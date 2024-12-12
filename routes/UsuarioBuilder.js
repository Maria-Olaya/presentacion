class Usuario {
    constructor(nombre, nombre_usuario, contrasena, fecha_nacimiento, genero, correo_electronico) {
        this.nombre = nombre;
        this.nombre_usuario = nombre_usuario;
        this.contrasena = contrasena;
        this.fecha_nacimiento = fecha_nacimiento;
        this.genero = genero;
        this.correo_electronico= correo_electronico;
    }
}

class UsuarioBuilder {
    constructor() {
        this.nombre = '';
        this.nombre_usuario = '';
        this.contrasena = '';
        this.fecha_nacimiento = null;
        this.genero = ''
        this.correo_electronico= '';
    }

    setNombre(nombre) {
        this.nombre = nombre;
        return this;
    }

    setNombreUsuario(nombre_usuario) {
        this.nombre_usuario = nombre_usuario;
        return this;
    }

    setContrasena(contrasena) {
        this.contrasena = contrasena;
        return this;
    }

    setFechaNacimiento(fecha_nacimiento) {
        this.fecha_nacimiento = fecha_nacimiento;
        return this;
    }

    setGenero(genero) {
        this.genero = genero;
        return this;
    }

    setCorreoElectronico(correo_electronico) {
        this.correo_electronico = correo_electronico;
        return this;
    }
    
    build() {
        return new Usuario(
            this.nombre,
            this.nombre_usuario,
            this.contrasena,
            this.fecha_nacimiento,
            this.genero,
            this.correo_electronico
        );
    }
}

module.exports = UsuarioBuilder;