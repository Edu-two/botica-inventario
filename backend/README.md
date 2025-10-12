# Botica – Backend MySQL con Roles (admin/empleado)

Backend Express + MySQL con selección de rol **administrador** o **empleado** y guardas de acceso.

## Instalación

```bash
npm i
cp .env.sample .env
# Crea la BD botica_db en phpMyAdmin antes de iniciar
npm run dev
```

Login demo: `admin / admin@demo.com / admin123`

## Roles y permisos

- **admin**: CRUD de productos, gestión de usuarios.
- **empleado**: puede registrar ventas y clientes (no modifica productos).
- El `rol` se valida y solo acepta `admin` o `empleado` (ENUM).

## Endpoints nuevos

- `GET /api/usuarios` (admin) – lista usuarios
- `POST /api/usuarios` (admin) – crea usuario con rol

  ```json
  { "nombre":"Ana", "username":"ana", "email":"ana@demo.com", "password":"clave", "rol":"empleado" }
  ```

- `PUT /api/usuarios/:id/rol` (admin) – cambia el rol

  ```json
  { "rol":"admin" }
  ```

## Cambios en rutas existentes

- `/api/productos` → `POST/PUT/DELETE` requieren `admin` (empleado solo GET)
- `/api/clientes` → autenticado (empleado puede crear/editar)
- `/api/ventas` → autenticado (empleado puede vender)

## SQL si ya tenías tablas

Para actualizar tu columna de rol sin recrear todo:

```sql
ALTER TABLE usuarios
  MODIFY rol ENUM('admin','empleado') NOT NULL DEFAULT 'empleado';

UPDATE usuarios SET rol='admin' WHERE username='admin';
```

-**En el backend database esta la base de datos completa y el usuario admin** este es para pruevas.
