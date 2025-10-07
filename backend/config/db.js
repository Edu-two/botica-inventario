const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "botica_db"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar con MySQL:", err);
    return;
  }
  console.log("✅ Conexión MySQL lista desde db.js");
});

module.exports = db;
