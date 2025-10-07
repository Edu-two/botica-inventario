# 📦 API Backend – Botica Inventario

Este backend fue desarrollado por **Brayan Leyva** para el proyecto _Software Web de Gestión de Inventario y Venta de una Botica_.  
Está conectado a una base de datos **MySQL (botica_db)** y provee endpoints REST para ser consumidos desde el frontend (Edgard Huayhua).

---

## ⚙️ Configuración de entorno (.env)
Antes de ejecutar el servidor, asegurarse de que el archivo `.env` tenga las siguientes variables:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234567
DB_NAME=botica_db
PORT=3001

yaml
Copiar código

---

## 🚀 Ejecución del servidor
Desde la carpeta `backend`:

```bash
node server.js
El servidor correrá en:
👉 http://localhost:3001

🧠 Estructura general del proyecto
arduino
Copiar código
backend/
├── server.js
├── config/
│   └── db.js
├── controllers/
│   └── productoController.js
├── routes/
│   └── productoRoutes.js
├── models/
│   ├── Producto.js
│   ├── Venta.js
│   └── Usuario.js
└── README_API.md
🧩 Endpoints – CRUD de Productos
Método	Ruta	Descripción
GET	/api/productos	Listar todos los productos
POST	/api/productos	Agregar un nuevo producto
PUT	/api/productos/:id	Actualizar un producto existente
DELETE	/api/productos/:id	Eliminar un producto

---

## 💰 Endpoints de Ventas

| Método | Ruta | Descripción |
|---------|------|-------------|
| GET | `/api/ventas` | Listar todas las ventas |
| POST | `/api/ventas` | Registrar nueva venta |
| PUT | `/api/ventas/:id` | Actualizar una venta |
| DELETE | `/api/ventas/:id` | Eliminar una venta |



