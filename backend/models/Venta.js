// Modelo Venta - representa la estructura de la tabla "ventas"
class Venta {
  constructor(id, fecha, total, id_usuario) {
    this.id = id;
    this.fecha = fecha;
    this.total = total;
    this.id_usuario = id_usuario;
  }
}

module.exports = Venta;
