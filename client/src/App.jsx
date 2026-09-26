import { useEffect, useMemo, useState } from 'react';
import './App.css';

import { useAuth } from './modules/auth/useAuth.js';
import Login from './modules/auth/Login.jsx';

import CardFloating from './modules/cards/CardFloating.jsx';
import CardSelector from './modules/cards/CardSelector.jsx';
import CardForm from './modules/cards/CardForm.jsx';

import MonthSelector from './modules/expenses/MonthSelector.jsx';
import ExpenseForm from './modules/expenses/ExpenseForm.jsx';
import ExpenseTable from './modules/expenses/ExpenseTable.jsx';

import SummaryCards from './modules/dashboard/SummaryCards.jsx';
import CategoryBreakdown from './modules/dashboard/CategoryBreakdown.jsx';

import { cardsApi } from './api/cards.js';
import { expensesApi } from './api/expenses.js';
import { fixedExpensesApi } from './api/fixedExpenses.js';
import { settingsApi } from './api/settings.js';

import { currentMonthKey, monthKeyFromDate } from './utils/format.js';
import EditableName from './components/EditableName.jsx';
import BottomNav from './components/BottomNav.jsx';
import FixedExpensesPage from './modules/fixed/FixedExpensesPage.jsx';

export default function App() {
  const auth = useAuth();
  // Antes de iniciar sesión no hay a qué configuración conectarse todavía
  // (vive protegida en la base de datos), así que el tema aquí es solo
  // visual y no se guarda — apenas entras, se sincroniza con tu preferencia real.
  const [preTheme, setPreTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', preTheme);
  }, [preTheme]);

  if (auth.checking) {
    return <FullScreenLoader />;
  }

  if (!auth.authenticated) {
    return (
      <>
        <button
          className="theme-toggle theme-toggle--floating"
          onClick={() => setPreTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          title="Cambiar tema"
        >
          {preTheme === 'dark' ? '☀' : '🌙'}
        </button>
        <Login auth={auth} />
      </>
    );
  }

  return <MainApp auth={auth} />;
}

function FullScreenLoader() {
  return (
    <div className="full-loader">
      <div className="full-loader-spinner" />
      <p>Cargando…</p>
    </div>
  );
}

function MainApp({ auth }) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [cards, setCards] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [fixedExpenses, setFixedExpenses] = useState([]);
  const [settings, setSettings] = useState({ displayName: 'Sr. Anderson BM', theme: 'dark', fixedLimit: 10000 });

  const [activeCardId, setActiveCardId] = useState(null);
  const [monthKey, setMonthKey] = useState(currentMonthKey());
  const [page, setPage] = useState('cards');

  const [showCardForm, setShowCardForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  // Carga inicial: todo viene de la base de datos, en paralelo.
  useEffect(() => {
    let cancelled = false;
    Promise.all([cardsApi.list(), expensesApi.list(), fixedExpensesApi.list(), settingsApi.get()])
      .then(([cardsRes, expensesRes, fixedRes, settingsRes]) => {
        if (cancelled) return;
        setCards(cardsRes);
        setExpenses(expensesRes);
        setFixedExpenses(fixedRes);
        setSettings(settingsRes);
        setActiveCardId(cardsRes[0]?.id ?? null);
      })
      .catch(() => {
        if (!cancelled) setLoadError('No se pudo cargar tu información. Revisa tu conexión e intenta de nuevo.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  const activeCard = useMemo(() => cards.find((c) => c.id === activeCardId) || null, [cards, activeCardId]);

  const monthExpenses = useMemo(() => {
    if (!activeCard) return [];
    return expenses.filter((e) => e.cardId === activeCard.id && monthKeyFromDate(e.date) === monthKey);
  }, [expenses, activeCard, monthKey]);

  const totalSpent = useMemo(() => monthExpenses.reduce((sum, e) => sum + e.amount, 0), [monthExpenses]);

  // --- ajustes (nombre, tema) ---
  async function handleNameChange(name) {
    setSettings((prev) => ({ ...prev, displayName: name }));
    await settingsApi.update({ displayName: name });
  }

  async function toggleTheme() {
    const next = settings.theme === 'dark' ? 'light' : 'dark';
    setSettings((prev) => ({ ...prev, theme: next }));
    await settingsApi.update({ theme: next });
  }

  async function handleFixedLimitChange(limit) {
    setSettings((prev) => ({ ...prev, fixedLimit: limit }));
    await settingsApi.update({ fixedLimit: limit });
  }

  // --- acciones sobre tarjetas ---
  async function handleSaveCard(cardForm) {
    if (editingCard) {
      const updated = await cardsApi.update(editingCard.id, cardForm);
      setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } else {
      const created = await cardsApi.create(cardForm);
      setCards((prev) => [...prev, created]);
      setActiveCardId(created.id);
    }
    setShowCardForm(false);
    setEditingCard(null);
  }

  async function handleDeleteCard(cardId) {
    if (!confirm('¿Eliminar esta tarjeta y todos sus gastos registrados?')) return;
    await cardsApi.remove(cardId);
    setCards((prev) => prev.filter((c) => c.id !== cardId));
    setExpenses((prev) => prev.filter((e) => e.cardId !== cardId));
    setShowCardForm(false);
    setEditingCard(null);
    setActiveCardId((id) => (id === cardId ? null : id));
  }

  // --- acciones sobre gastos ---
  async function handleSaveExpense(expenseForm) {
    if (!activeCard) return;
    const created = await expensesApi.create({ ...expenseForm, cardId: activeCard.id });
    setExpenses((prev) => [...prev, created]);
    setShowExpenseForm(false);
  }

  async function handleDeleteExpense(expenseId) {
    await expensesApi.remove(expenseId);
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
  }

  if (loading) return <FullScreenLoader />;

  if (loadError) {
    return (
      <div className="full-loader">
        <p>{loadError}</p>
        <button className="btn btn-secondary" style={{ marginTop: 12 }} onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-eyebrow">Hola de nuevo</p>
          <EditableName value={settings.displayName} onChange={handleNameChange} />
        </div>
        <div className="app-header-actions">
          <button className="icon-btn" onClick={toggleTheme} title="Cambiar tema">
            {settings.theme === 'dark' ? '☀' : '🌙'}
          </button>
          <button className="icon-btn" onClick={auth.logout} title="Cerrar sesión">
            ⏻
          </button>
        </div>
      </header>

      {page === 'cards' ? (
        <>
          <CardFloating
            card={activeCard}
            onEdit={() => {
              if (!activeCard) return;
              setEditingCard(activeCard);
              setShowCardForm(true);
            }}
          />

          <CardSelector
            cards={cards}
            activeCardId={activeCardId}
            onSelect={setActiveCardId}
            onAdd={() => {
              setEditingCard(null);
              setShowCardForm(true);
            }}
          />

          {activeCard ? (
            <>
              <MonthSelector monthKey={monthKey} onChange={setMonthKey} />
              <SummaryCards card={activeCard} totalSpent={totalSpent} />
              <CategoryBreakdown expenses={monthExpenses} />

              <div className="section-heading">
                <h3>Movimientos</h3>
                <button className="btn-add-expense" onClick={() => setShowExpenseForm(true)}>
                  + Gasto
                </button>
              </div>
              <ExpenseTable expenses={monthExpenses} onDelete={handleDeleteExpense} />
            </>
          ) : (
            <div className="no-cards-hint">
              <p>Agrega tu primera tarjeta para empezar a llevar el control.</p>
            </div>
          )}
        </>
      ) : (
        <FixedExpensesPage
          items={fixedExpenses}
          setItems={setFixedExpenses}
          fixedLimit={settings.fixedLimit}
          onChangeLimit={handleFixedLimitChange}
        />
      )}

      <BottomNav page={page} onChange={setPage} />

      {showCardForm && (
        <CardForm
          initialCard={editingCard}
          onSave={handleSaveCard}
          onDelete={handleDeleteCard}
          onClose={() => {
            setShowCardForm(false);
            setEditingCard(null);
          }}
        />
      )}

      {showExpenseForm && activeCard && (
        <ExpenseForm
          cardName={activeCard.name}
          onSave={handleSaveExpense}
          onClose={() => setShowExpenseForm(false)}
        />
      )}
    </div>
  );
}
