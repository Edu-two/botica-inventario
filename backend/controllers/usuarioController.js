const db = require("../config/db");
const bcrypt = require("bcryptjs");

// 📋 Obtener todos los usuarios (para pruebas)
exports.obtenerUsuarios = (req, res) => {
  db.query("SELECT id, nombre, correo, rol FROM usuarios", (err, results) => {
    if (err) {
      console.error("❌ Error al obtener usuarios:", err);
      return res.status(500).json({ error: "Error al obtener usuarios" });
    }
    res.json(results);
  });
};

// ➕ Registrar nuevo usuario
exports.registrarUsuario = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  // Encriptar contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = "INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)";
  db.query(query, [nombre, correo, hashedPassword, rol || "empleado"], (err, result) => {
    if (err) {
      console.error("❌ Error al registrar usuario:", err);
      return res.status(500).json({ error: "Error al registrar usuario" });
    }
    res.json({ message: "✅ Usuario registrado correctamente", id: result.insertId });
  });
};

// 🔐 Login de usuario
exports.loginUsuario = (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
  }

  const query = "SELECT * FROM usuarios WHERE correo = ?";
  db.query(query, [correo], async (err, results) => {
    if (err) {
      console.error("❌ Error en login:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = results[0];
    const passwordCorrecta = await bcrypt.compare(password, user.password);

    if (!passwordCorrecta) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.json({
      message: "✅ Login exitoso",
      usuario: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol
      }
    });
  });
};
