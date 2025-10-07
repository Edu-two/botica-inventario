const db = require("../config/db");

// 📋 Obtener todos los productos
exports.obtenerProductos = (req, res) => {
  const query = "SELECT * FROM productos";
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener productos:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
    res.json(results);
  });
};

// ➕ Agregar un producto
exports.agregarProducto = (req, res) => {
  const { nombre, categoria, precio, stock } = req.body;
  if (!nombre || !precio) {
    return res.status(400).json({ error: "El nombre y precio son obligatorios" });
  }

  const query = "INSERT INTO productos (nombre, categoria, precio, stock) VALUES (?, ?, ?, ?)";
  db.query(query, [nombre, categoria, precio, stock], (err, result) => {
    if (err) {
      console.error("❌ Error al agregar producto:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
    res.json({ message: "✅ Producto agregado correctamente", id: result.insertId });
  });
};

// ✏️ Actualizar un producto
exports.actualizarProducto = (req, res) => {
  const { id } = req.params;
  const { nombre, categoria, precio, stock } = req.body;

  const query = "UPDATE productos SET nombre=?, categoria=?, precio=?, stock=? WHERE id=?";
  db.query(query, [nombre, categoria, precio, stock, id], (err, result) => {
    if (err) {
      console.error("❌ Error al actualizar producto:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ message: "✅ Producto actualizado correctamente" });
  });
};

// 🗑️ Eliminar un producto
exports.eliminarProducto = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM productos WHERE id=?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("❌ Error al eliminar producto:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ message: "🗑️ Producto eliminado correctamente" });
  });
};
