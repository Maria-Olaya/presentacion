const express = require('express');
const router = express.Router();
const conexion = require('../dababase/database');
const upload = require('../config/multerConfig');
const bcrypt = require('bcryptjs');
const UsuarioBuilder = require('../routes/UsuarioBuilder');


const verificarAutenticacion = require('../middlewares/authMiddleware'); // Importa el middleware

router.post('/register', (req, res) => {
    const { nombre, nombre_usuario, contrasena, fecha_nacimiento, genero, correo_electronico } = req.body;

    const usuario = new UsuarioBuilder()
         .setNombre(nombre)
         .setNombreUsuario(nombre_usuario)
         .setContrasena(contrasena)
         .setFechaNacimiento(fecha_nacimiento)
         .setGenero(genero)
         .setCorreoElectronico(correo_electronico)
         .build();

    bcrypt.hash(contrasena, 10, (err, hash) => {
        if (err) {
            console.error('Error al encriptar la contraseña:', err);
            return res.status(500).send('Error al registrar el usuario');
        }

        const query = 'INSERT INTO usuarios (nombre, nombre_usuario, email, contraseña, fecha_nacimiento, genero) VALUES (?, ?, ?, ?, ?, ?)';
        conexion.query(query, [usuario.nombre, usuario.nombre_usuario, usuario.correo_electronico, hash, usuario.fecha_nacimiento, usuario.genero], (err, results) => {
            if (err) {
                console.error('Error al registrar el usuario:', err);
                return res.status(500).send('Error al registrar el usuario');
            }
            res.redirect('/index.html'); 
        });
    });
});

module.exports = router;