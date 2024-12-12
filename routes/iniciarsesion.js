const express = require('express');
const router = express.Router();
const conexion = require('../dababase/database');
const upload = require('../config/multerConfig');
const verificarAutenticacion = require('../middlewares/authMiddleware'); // Importa el middleware
const bcrypt = require('bcryptjs');


router.post('/login', (req, res) => {
    const { nombre_usuario, contrasena } = req.body;

    console.log('Nombre de usuario:', nombre_usuario); // Verificar el nombre de usuario
    console.log('Contraseña:', contrasena); // Verificar la contraseña

    const query = 'SELECT * FROM usuarios WHERE nombre_usuario = ?';
    conexion.query(query, [nombre_usuario], (err, results) => {
        if (err) {
            console.error('Error al iniciar sesión:', err);
            res.status(500).send('Error al iniciar sesión');
            return;
        }

        if (results.length > 0) {
            const user = results[0];
            console.log('Usuario encontrado:', user); // Verificar el usuario encontrado

            bcrypt.compare(contrasena, user.contraseña, (err, isMatch) => {
                if (err) {
                    console.error('Error al comparar contraseñas:', err);
                    res.status(500).send('Error al iniciar sesión');
                    return;
                }

                if (isMatch) {
                    req.session.userId = user.id;
                    // Ejemplo de almacenamiento en sessionStorage después de iniciar sesión
                  
                    console.log('Inicio de sesión exitoso. ID de usuario guardado en la sesión:', req.session.userId);

                    res.redirect('/feed.html'); // Redirigir al feed después del inicio de sesión
                } else {
                    console.log('Credenciales incorrectas. Contraseña no coincide.');
                    res.send('Credenciales incorrectas');
                }
            });
        } else {
            console.log('Credenciales incorrectas. Usuario no encontrado.');
            res.send('Credenciales incorrectas');
        }
    });
});
module.exports = router;