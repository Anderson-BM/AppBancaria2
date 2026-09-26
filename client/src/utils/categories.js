export const CATEGORIES = [
  'Comida', 'Transporte', 'Servicios', 'Casa', 'Entretenimiento',
  'Salud', 'Ropa', 'Combustible', 'Compromiso', 'Otros',
];

// Paleta fija para gráficas (no cambia con el tema claro/oscuro,
// así cada categoría mantiene siempre el mismo color e identificable).
export const CHART_COLORS = [
  '#1fb6ad', '#f5a623', '#5b7fff', '#e0615a',
  '#4fcf8f', '#a367e8', '#ffb86b', '#38bdf8',
  '#f472b6', '#84cc16',
];

export function colorForIndex(i) {
  return CHART_COLORS[i % CHART_COLORS.length];
}
