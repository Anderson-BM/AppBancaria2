# Mis Tarjetas

App personal para llevar el control de tus tarjetas de crédito: límites,
fecha de pago, gastos mes a mes, gastos fijos y una tarjeta flotante con tu
propia imagen. Ahora con **base de datos real (Neon/Postgres)**: tu
información no vive en el navegador, así que la ves igual entres desde el
celular, la computadora o donde sea.

## Estructura del proyecto

```
client/     -> React + Vite (el diseño, sin cambios)
server/     -> API en Express + Postgres (Neon)
Dockerfile  -> compila el cliente y lo sirve junto con el servidor, todo en un contenedor
```

```
client/src/
  modules/     -> auth, cards, expenses, dashboard, fixed (mismos de siempre)
  components/   -> Modal, EditableName, BottomNav
  api/          -> funciones que hablan con el backend (reemplazan al storage.js de antes)
  utils/        -> formato, categorías, procesamiento de imagen

server/src/
  index.js      -> arranca Express, sirve la API y el cliente compilado
  db.js         -> conexión a Neon
  migrate.js    -> crea las tablas automáticamente al arrancar
  auth.js       -> sesión por cookie (JWT)
  routes/       -> auth, cards, expenses, fixedExpenses, settings
```

## 1. Crear tu base de datos en Neon

1. Entra a [neon.tech](https://neon.tech) y crea una cuenta (tiene plan gratis).
2. Crea un proyecto nuevo — te da una base llamada `neondb` por defecto.
3. En el dashboard del proyecto, copia el **Connection string** (elige la
   variante *pooled*, la que dice `-pooler` en el host — funciona mejor con
   contenedores). Se ve así:
   ```
   postgresql://usuario:password@ep-xxxx-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Guarda esa cadena — es tu `DATABASE_URL`. No necesitas crear tablas a
   mano: el servidor las crea solo la primera vez que arranca.

## 2. Desarrollo local

Necesitas Node.js 18+ y dos terminales abiertas (una para el servidor, otra
para el cliente).

**Servidor:**
```bash
cd server
cp .env.example .env
# edita .env y pega tu DATABASE_URL de Neon, y cambia JWT_SECRET por algo tuyo
npm install
npm run dev
```
Debe decir `✔ Servidor escuchando en el puerto 3000`.

**Cliente** (en otra terminal):
```bash
cd client
npm install
npm run dev
```

Abre `http://localhost:5173`. El cliente le habla al servidor en el puerto
3000 automáticamente (ya está configurado en `vite.config.js`).

## 3. Desplegar en tu server (EasyPanel u otro con Docker)

El `Dockerfile` de la raíz compila el cliente y arranca el servidor en un
solo contenedor — no necesitas nada más instalado en el server.

En EasyPanel:

1. Crea (o edita) tu **App Service**, con este repo como fuente.
2. En **Build**, selecciona **Dockerfile** (no Nixpacks) — igual que la vez
   pasada.
3. En **Environment** (variables de entorno del servicio), agrega:
   - `DATABASE_URL` → tu cadena de conexión de Neon (la del paso 1).
   - `JWT_SECRET` → cualquier texto largo y secreto, inventado por ti.
   - `NODE_ENV` → `production`
4. En **Domains/Proxy**, el puerto ahora es **3000** (ya no 80, porque no
   usamos nginx — el propio Express sirve todo).
5. Dale **Deploy**. En los logs del build deberías ver
   `✔ Base de datos lista (esquema aplicado)` seguido de
   `✔ Servidor escuchando en el puerto 3000`.

La primera vez que abras la app te va a pedir crear tu PIN otra vez (antes
vivía en el navegador; ahora vive en la base de datos, protegido con
bcrypt). De ahí en adelante, entres desde donde entres, vas a ver la misma
información.

## Cómo funciona ahora

- **Todo pasa por la API:** cada tarjeta, gasto, gasto fijo y ajuste
  (nombre, tema, límite) se guarda en Postgres en el momento — no hay
  ningún dato en `localStorage`.
- **Sesión:** el login por PIN ahora lo valida el servidor (con bcrypt) y
  te da una cookie de sesión (httpOnly, 30 días). Por eso al entrar desde
  otro dispositivo tienes que volver a meter el PIN, pero los datos que ves
  son siempre los mismos.
- **Imágenes de tarjeta:** se siguen procesando en el navegador (recorte a
  HD, proporción de tarjeta real, fondo blanco si la foto tiene
  transparencia) antes de subirse, así que no pesan de más en la base de
  datos.

## Variables de entorno del servidor

| Variable | Para qué | Obligatoria |
|---|---|---|
| `DATABASE_URL` | Conexión a tu base en Neon | Sí |
| `JWT_SECRET` | Firma la cookie de sesión | Sí (en producción) |
| `PORT` | Puerto del servidor (default 3000) | No |
| `CLIENT_ORIGIN` | Solo para desarrollo local, origen del cliente Vite | No |
| `NODE_ENV` | `production` en el server desplegado | Recomendada |

## Próximos pasos posibles

- Multi-usuario (cuentas separadas) si algún día quieres compartir la app.
- Notificaciones antes de la fecha de pago.
- Exportar el historial de un mes a Excel/CSV.