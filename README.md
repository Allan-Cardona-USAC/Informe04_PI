# USAC Reviews App (Versión de Prueba)

Aplicación web para registrar y consultar publicaciones sobre **cursos** y **catedráticos/auxiliares**, con comentarios y perfiles de usuarios.
Frontend en **React (Vite)**, backend en **Node.js (Express)** y base de datos **MySQL**.

> Cumple los requerimientos de la práctica: arquitectura cliente/servidor, Angular/React (se usa React), NodeJS REST API, DB (MySQL), autenticación (registro, login, restablecer contraseña), feed con filtros, publicaciones y comentarios, perfiles y cursos aprobados. 

## Estructura
```
client/   # React + Vite
server/   # Node.js + Express + MySQL (mysql2)
docs/     # SQL y postman collection
```

## Requisitos
- Node.js 18+
- MySQL 8+
- npm 9+

## Pasos de instalación
1) Clonar/copiar el proyecto y crear la base de datos:
```bash
mysql -u root -p < docs/schema.sql
```
2) Backend:
```bash
cd server
cp .env.example .env   # edita credenciales y JWT_SECRET
npm install
npm run dev            # o npm start
```
3) Frontend:
```bash
cd client
npm install
npm run dev
```
Por defecto el backend corre en `http://localhost:4000` y el frontend en `http://localhost:5173`.

## Variables de entorno (server/.env)
```
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=usac_reviews
JWT_SECRET=supersecret
FRONTEND_URL=http://localhost:5173
EMAIL_FROM=no-reply@example.com
# Para pruebas locales, el "restablecer contraseña" solo imprime el token en consola.
```

## Importante
- Incluimos un "semillado" mínimo de cursos/catedráticos en `docs/seed.sql` (opcional).
- La ruta `/docs/usac-reviews.postman_collection.json` contiene endpoints para probar.

## Comandos
- `server`: `npm run dev` (nodemon) o `npm start` (node).
- `client`: `npm run dev` para desarrollo, `npm run build` para producción.

## Notas de seguridad
- Las contraseñas se almacenan con **bcrypt**.
- Autenticación con **JWT** (header `Authorization: Bearer <token>`).
- CORS configurado para el frontend.

---

© 2025 – Proyecto educativo.


## Despliegue con Docker (un solo comando)

1) Instala Docker Desktop.
2) Desde la raíz del proyecto:
```bash
docker compose up -d --build
```
- **web** en http://localhost:5173
- **api** en http://localhost:4000
- **db** MySQL en localhost:3306 (usuario: root / pass: root)

> La primera vez, MySQL cargará automáticamente `docs/schema.sql` y `docs/seed.sql`.
        

### Demo data
Usuarios de prueba (contraseña: **123456**): juan@example.com, maria@example.com, carlos@example.com, ana@example.com.
