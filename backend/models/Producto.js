// Modelo Producto - representa la estructura de la tabla "productos"
class Producto {
  constructor(id, nombre, categoria, precio, stock) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
    this.stock = stock;
  }
}

module.exports = Producto;
