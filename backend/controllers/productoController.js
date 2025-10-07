import { connection } from "../config/db.js";

export const getProductos = (req, res) => {
  connection.query("SELECT * FROM productos", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const createProducto = (req, res) => {
  const { nombre, stock, precio, categoria } = req.body;
  const sql = "INSERT INTO productos (nombre, stock, precio, categoria) VALUES (?, ?, ?, ?)";
  connection.query(sql, [nombre, stock, precio, categoria], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Producto agregado", id: result.insertId });
  });
};

export const updateProducto = (req, res) => {
  const { id } = req.params;
  const { nombre, stock, precio, categoria } = req.body;
  const sql = "UPDATE productos SET nombre=?, stock=?, precio=?, categoria=? WHERE id=?";
  connection.query(sql, [nombre, stock, precio, categoria, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Producto actualizado" });
  });
};

export const deleteProducto = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM productos WHERE id=?";
  connection.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Producto eliminado" });
  });
};
