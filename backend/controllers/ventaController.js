const db = require("../config/db");

// 📋 Obtener todas las ventas
exports.obtenerVentas = (req, res) => {
  const query = "SELECT * FROM ventas ORDER BY fecha DESC";
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener ventas:", err);
      return res.status(500).json({ error: "Error al obtener ventas" });
    }
    res.json(results);
  });
};

// ➕ Registrar nueva venta
exports.agregarVenta = (req, res) => {
  const { total, id_usuario } = req.body;

  if (!total) {
    return res.status(400).json({ error: "El total es obligatorio" });
  }

  const query = "INSERT INTO ventas (total, id_usuario) VALUES (?, ?)";
  db.query(query, [total, id_usuario || null], (err, result) => {
    if (err) {
      console.error("❌ Error al registrar venta:", err);
      return res.status(500).json({ error: "Error al registrar venta" });
    }
    res.json({ message: "✅ Venta registrada correctamente", id: result.insertId });
  });
};

// ✏️ Actualizar una venta
exports.actualizarVenta = (req, res) => {
  const { id } = req.params;
  const { total, id_usuario } = req.body;

  const query = "UPDATE ventas SET total=?, id_usuario=? WHERE id=?";
  db.query(query, [total, id_usuario, id], (err, result) => {
    if (err) {
      console.error("❌ Error al actualizar venta:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }
    res.json({ message: "✅ Venta actualizada correctamente" });
  });
};

// 🗑️ Eliminar una venta
exports.eliminarVenta = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM ventas WHERE id=?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("❌ Error al eliminar venta:", err);
      return res.status(500).json({ error: "Error al eliminar venta" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }
    res.json({ message: "🗑️ Venta eliminada correctamente" });
  });
};
