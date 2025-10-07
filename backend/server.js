const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "botica_db"
});

db.connect(err => {
  if (err) {
    console.error("❌ Error conectando a la base de datos:", err);
    return;
  }
  console.log("✅ Conexión a la base de datos exitosa");
});

// Ruta simple
app.get("/", (req, res) => {
  res.send("Servidor Backend de Botica funcionando correctamente");
});

app.listen(3001, () => console.log("🚀 Servidor corriendo en puerto 3001"));
