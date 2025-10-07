const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

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

app.get("/", (req, res) => {
  res.send("Servidor Backend de Botica funcionando correctamente 🧠💊");
});

const productoRoutes = require("./routes/productoRoutes");
const ventaRoutes = require("./routes/ventaRoutes");
app.use("/api/productos", productoRoutes);
app.use("/api/ventas", ventaRoutes);

app.listen(3001, () => {
  console.log("🚀 Servidor corriendo en puerto 3001");
});
