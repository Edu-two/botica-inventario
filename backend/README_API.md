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

🧪 Ejemplos para probar (Thunder Client o Postman)
🔹 GET – Obtener productos
bash
Copiar código
GET http://localhost:3001/api/productos
Respuesta:

json
Copiar código
[
  {
    "id": 1,
    "nombre": "Paracetamol 500mg",
    "categoria": "Medicamento",
    "precio": 1.50,
    "stock": 100
  }
]
🔹 POST – Agregar producto
bash
Copiar código
POST http://localhost:3001/api/productos
Body (JSON):

json
Copiar código
{
  "nombre": "Ibuprofeno 400mg",
  "categoria": "Medicamento",
  "precio": 2.00,
  "stock": 80
}
Respuesta:

json
Copiar código
{
  "message": "✅ Producto agregado correctamente",
  "id": 2
}
🔹 PUT – Actualizar producto
bash
Copiar código
PUT http://localhost:3001/api/productos/2
Body (JSON):

json
Copiar código
{
  "nombre": "Ibuprofeno 400mg",
  "categoria": "Analgésico",
  "precio": 2.50,
  "stock": 120
}
Respuesta:

json
Copiar código
{
  "message": "✅ Producto actualizado correctamente"
}
🔹 DELETE – Eliminar producto
bash
Copiar código
DELETE http://localhost:3001/api/productos/2
Respuesta:

json
Copiar código
{
  "message": "🗑️ Producto eliminado correctamente"
}
💬 Integración desde frontend (para Edgard)
Ejemplo básico de consumo con fetch en JavaScript:

js
Copiar código
// Obtener todos los productos
fetch("http://localhost:3001/api/productos")
  .then(res => res.json())
  .then(data => console.log("Productos:", data));

// Agregar un producto
fetch("http://localhost:3001/api/productos", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    nombre: "Amoxicilina 500mg",
    categoria: "Antibiótico",
    precio: 3.5,
    stock: 60
  })
})
  .then(res => res.json())
  .then(data => console.log("Respuesta:", data));
🧾 Autor y colaborador
Backend: Brayan Leyva Gutiérrez

Integración API / Frontend: Edgard Huayhua

Proyecto: Botica “Nova Salud”

Curso: Fullstack Developer Software – SENATI

yaml
Copiar código

---

## 🚀 Después de guardarlo
1. Guarda el archivo como `README_API.md` en `/backend`.
2. Luego súbelo a tu rama:

```bash
git add README_API.md
git commit -m "Agregado README_API con documentación de endpoints"
git push origin bryan-backend
