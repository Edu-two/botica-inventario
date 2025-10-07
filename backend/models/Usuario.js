// Modelo Usuario - representa la estructura de la tabla "usuarios"
class Usuario {
  constructor(id, nombre, rol, password) {
    this.id = id;
    this.nombre = nombre;
    this.rol = rol;
    this.password = password;
  }
}

module.exports = Usuario;
