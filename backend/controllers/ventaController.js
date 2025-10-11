// backend/controllers/ventaController.js
import { connection } from "../config/db.js";

export const getVentas = (req, res) => {
  const sql = `
    SELECT v.id, v.fecha, v.total, u.nombre AS vendedor
    FROM ventas v
    INNER JOIN usuarios u ON v.id_usuario = u.id
    ORDER BY v.fecha DESC;
  `;
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getVentaById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT v.id, v.fecha, v.total, u.nombre AS vendedor
    FROM ventas v
    INNER JOIN usuarios u ON v.id_usuario = u.id
    WHERE v.id = ?;
  `;
  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Venta no encontrada" });
    res.json(results[0]);
  });
};

export const createVenta = (req, res) => {
  const { id_usuario, productos } = req.body; // productos: [{id_producto, cantidad}]
  
  // Calcular total y registrar venta
  let total = 0;
  productos.forEach(p => total += p.precio * p.cantidad);

  const sqlVenta = "INSERT INTO ventas (fecha, total, id_usuario) VALUES (NOW(), ?, ?)";
  connection.query(sqlVenta, [total, id_usuario], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    const idVenta = result.insertId;

    // Insertar detalles
    const sqlDetalle = "INSERT INTO detalle_venta (id_venta, id_producto, cantidad) VALUES ?";
    const values = productos.map(p => [idVenta, p.id_producto, p.cantidad]);
    connection.query(sqlDetalle, [values], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: "Venta registrada", id_venta: idVenta, total });
    });
  });
};
