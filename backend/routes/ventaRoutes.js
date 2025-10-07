const express = require("express");
const router = express.Router();
const ventaController = require("../controllers/ventaController");

// Endpoints CRUD de ventas
router.get("/", ventaController.obtenerVentas);
router.post("/", ventaController.agregarVenta);
router.put("/:id", ventaController.actualizarVenta);
router.delete("/:id", ventaController.eliminarVenta);

module.exports = router;
