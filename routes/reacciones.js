
const express = require('express');
const router = express.Router();
const conexion = require('../dababase/database');
const upload = require('../config/multerConfig');
const verificarAutenticacion = require('../middlewares/authMiddleware'); // Importa el middleware

// Ruta para guardar una reacción
router.post('/reacciones', verificarAutenticacion, (req, res) => {
    const { publicacion_id, tipo_reaccion } = req.body;

    // Verificar que ambos campos no sean null o undefined
    if (!publicacion_id || !tipo_reaccion) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const usuario_id = req.session.userId; // ID del usuario desde la sesión

    // Insertar o actualizar la reacción
    const query = `
        INSERT INTO reacciones (publicacion_id, usuario_id, tipo_reaccion, fecha_reaccion)
        VALUES (?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE tipo_reaccion = ?, fecha_reaccion = NOW()`;

    conexion.query(query, [publicacion_id, usuario_id, tipo_reaccion, tipo_reaccion], (err, result) => {
        if (err) {
            console.error('Error al guardar la reacción:', err);
            return res.status(500).json({ error: 'Error al guardar la reacción' });
        }

        // Comprobar si se realizó una inserción o una actualización
        const mensaje = result.affectedRows === 1 ? 'Reacción guardada exitosamente' : 'Reacción actualizada exitosamente';
        res.status(200).json({ message: mensaje, tipo_reaccion: tipo_reaccion });
    });
});

// Ruta para obtener la reacción de un usuario a una publicación
router.get('/reacciones/:publicacionId', verificarAutenticacion, (req, res) => {
    const publicacionId = req.params.publicacionId;
    const usuario_id = req.session.userId; // Obtener ID del usuario desde la sesión

    const query = `
        SELECT tipo_reaccion 
        FROM reacciones 
        WHERE publicacion_id = ? AND usuario_id = ?
    `;

    conexion.query(query, [publicacionId, usuario_id], (err, results) => {
        if (err) {
            console.error('Error al obtener la reacción:', err);
            return res.status(500).json({ error: 'Error al obtener la reacción' });
        }
        if (results.length > 0) {
            res.json({ tipo_reaccion: results[0].tipo_reaccion });
        } else {
            res.json({ tipo_reaccion: null }); // Sin reacción
        }
    });
});


module.exports = router;