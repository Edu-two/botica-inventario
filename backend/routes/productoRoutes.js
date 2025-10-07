const express = require("express");
const router = express.Router();
const productoController = require("../controllers/productoController");

// Endpoints CRUD
router.get("/", productoController.obtenerProductos);
router.post("/", productoController.agregarProducto);
router.put("/:id", productoController.actualizarProducto);
router.delete("/:id", productoController.eliminarProducto);

module.exports = router;
