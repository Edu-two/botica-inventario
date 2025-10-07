// ===============================
//  SERVIDOR PRINCIPAL BACKEND
//  Proyecto: Botica Inventario
//  Autor: Brayan Leyva Gutiérrez
// ===============================

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ===============================
//  CONEXIÓN A LA BASE DE DATOS
// ===============================
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234567",
  database: process.env.DB_NAME || "botica_db",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error conectando a la base de datos:", err);
    return;
  }
  console.log("✅ Conexión a la base de datos exitosa");
});

// ===============================
//  RUTA BASE (VERIFICAR SERVIDOR)
// ===============================
app.get("/", (req, res) => {
  res.send("Servidor Backend de Botica funcionando correctamente 🧠💊");
});

// ===============================
//  RUTAS DEL BACKEND
// ===============================
const productoRoutes = require("./routes/productoRoutes");
const ventaRoutes = require("./routes/ventaRoutes");

app.use("/api/productos", productoRoutes);
app.use("/api/ventas", ventaRoutes);

// ===============================
//  INICIO DEL SERVIDOR
// ===============================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
