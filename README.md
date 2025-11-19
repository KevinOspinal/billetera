## Billetera Finanzas

Aplicación Next.js orientada a controlar cuentas, transacciones, reportes y presupuestos con un panel responsive y soporte de tema claro/oscuro.

## Requisitos

- Node.js 20+
- PostgreSQL 14+

## Configuración

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Duplica `.env.example` como `.env.local` y establece las credenciales:

   ```env
   DATABASE_URL="postgresql://usuario:password@localhost:5432/billetera_finanzas"
   AUTH_SECRET="cadena-super-secreta"
   ```

3. Ejecuta migraciones o scripts SQL (ver carpeta `docs` o tus apuntes) para crear tablas e insertar datos iniciales. Para soportar login añade la columna y la contraseña hasheada:

   ```sql
   ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
   UPDATE users
      SET password_hash = '$2a$10$zGfqaXx3F0m0hP3vSfs4A.2xJLbnQ7blablabla'
    WHERE email = 'tu-correo@dominio.com';
   ```

   Genera un hash con `node -e "console.log(require('bcryptjs').hashSync('mi-contraseña', 10))"` y reemplázalo en el update.

## Comandos

```bash
npm run dev     # desarrolla en http://localhost:3000
npm run build   # compila para producción
npm run start   # sirve la build
npm run lint    # ejecuta eslint
```

## API REST (Next.js App Router)

Los endpoint viven bajo `/api` y usan PostgreSQL por medio del cliente `pg`. Todos requieren el `DATABASE_URL` configurado.

| Recurso | Métodos disponibles | Descripción |
| ------- | ------------------- | ----------- |
| `/api/accounts?userId=1` | `GET`, `POST` | Listar o crear cuentas para un usuario. |
| `/api/accounts/:id` | `GET`, `PUT`, `DELETE` | Opera sobre una cuenta específica. |
| `/api/transactions?userId=1&accountId=2&startDate=2024-05-01` | `GET`, `POST` | CRUD de movimientos y filtros por cuenta/categoría/fecha/tipo. |
| `/api/transactions/:id` | `GET`, `PUT`, `DELETE` | Modifica transacciones y ajusta el saldo de la cuenta afectada. |
| `/api/categories?userId=1` | `GET`, `POST` | Catálogo de categorías de ingreso/gasto. |
| `/api/categories/:id` | `PUT`, `DELETE` | Actualizaciones puntuales del catálogo. |
| `/api/budgets?userId=1` | `GET`, `POST` | CRUD de presupuestos por categoría y periodo. |
| `/api/budgets/:id` | `PUT`, `DELETE` | Mantiene presupuestos existentes. |

### Ejemplos con `curl`

```bash
# Crear transacción
curl -X POST http://localhost:3000/api/transactions \\
  -H "Content-Type: application/json" \\
  -d '{
    "userId": 1,
    "accountId": 1,
    "categoryId": 2,
    "type": "expense",
    "amount": 350000,
    "description": "Compra supermercado",
    "transactionDate": "2024-05-12"
  }'

# Listar cuentas del usuario 1
curl "http://localhost:3000/api/accounts?userId=1"
```

Cada respuesta devuelve `{ data: ... }` o `{ error: ... }`. Los códigos HTTP siguen la semántica estándar (`201` al crear, `400` para errores de validación, `404` si no existe el recurso).

## Autenticación y navegación protegida

- Ruta pública: `/login`. Muestra un formulario simple que golpea `POST /api/auth/login`, guarda la sesión en una cookie httpOnly y redirige al dashboard.
- Rutas privadas: `/(protected)/...` (`/dashboard`, `/transactions`, `/accounts`, `/reports`, `/budgets`). El `middleware.js` revisa la cookie `session`; si no existe, redirige al login, y si ya estás autenticado impide volver al login.
- Botón “Cerrar sesión” en la barra superior llama `POST /api/auth/logout` y limpia la cookie.
- Puedes consultar el usuario actual con `GET /api/auth/me` si necesitas sincronizar estado del lado del cliente.

## Integración con el frontend

El frontend consulta los endpoint anteriores mediante `fetch`. Puedes crear hooks/servicios que peguen a `/api/...` y reutilicen los filtros existentes (por ejemplo, filtros de transacciones por cuenta, categoría y rango de fechas). Al crear/editar transacciones, el backend actualiza automáticamente el balance de la cuenta, por lo que el dashboard siempre recibe datos consistentes. El layout protegido lee la sesión en el servidor (`getSessionUser`) para personalizar la UI.
