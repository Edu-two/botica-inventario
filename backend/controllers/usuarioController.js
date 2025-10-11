// backend/controllers/usuarioController.js
import { connection } from "../config/db.js";
import bcrypt from "bcrypt";

export const getUsuarios = (req, res) => {
  connection.query("SELECT id, nombre, rol FROM usuarios", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const createUsuario = async (req, res) => {
  const { nombre, contraseña, rol } = req.body;

  if (!nombre || !contraseña) {
    return res.status(400).json({ message: "Faltan campos requeridos" });
  }

  const hashed = await bcrypt.hash(contraseña, 10);
  const sql = "INSERT INTO usuarios (nombre, contraseña, rol) VALUES (?, ?, ?)";
  connection.query(sql, [nombre, hashed, rol || "vendedor"], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Usuario registrado", id: result.insertId });
  });
};

export const loginUsuario = (req, res) => {
  const { nombre, contraseña } = req.body;
  const sql = "SELECT * FROM usuarios WHERE nombre = ?";
  connection.query(sql, [nombre], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });

    const user = results[0];
    const valid = await bcrypt.compare(contraseña, user.contraseña);
    if (!valid) return res.status(401).json({ message: "Contraseña incorrecta" });

    res.json({ message: "Login exitoso", id: user.id, rol: user.rol });
  });
};
