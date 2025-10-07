// Rutas para Productos
const express = require("express");
const router = express.Router();
const productoController = require("../controllers/productoController");

// Definición de endpoints
router.get("/", productoController.obtenerProductos);
router.post("/", productoController.agregarProducto);

module.exports = router;
