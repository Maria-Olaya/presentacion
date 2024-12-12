const express = require('express');
const router = express.Router();
const conexion = require('../dababase/database');
const upload = require('../config/multerConfig');
const verificarAutenticacion = require('../middlewares/authMiddleware'); // Importa el middleware


// Obtener comentarios de una publicación
router.get('/comentarios/:publicacionId', verificarAutenticacion, (req, res) => {
    const publicacionId = req.params.publicacionId;

    const query = `
        SELECT c.comentario, c.fecha_comentario AS fecha, u.nombre_usuario 
        FROM comentarios c 
        JOIN usuarios u ON c.usuario_id = u.id 
        WHERE c.publicacion_id = ?
        ORDER BY c.fecha_comentario DESC
    `;

    conexion.query(query, [publicacionId], (err, results) => {
        if (err) {
            console.error('Error al cargar comentarios:', err);
            return res.status(500).json({ error: 'Error al cargar comentarios' });
        }
        res.json(results);
    });
});

// Guardar un comentario
router.post('/comentarios', verificarAutenticacion, (req, res) => {
    const { comentario, publicacion_id } = req.body;
    
    // Verificar que ambos campos no sean null o undefined
    if (!comentario || !publicacion_id) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const usuario_id = req.session.userId; // Obtener ID del usuario desde la sesión

    const query = 'INSERT INTO comentarios (publicacion_id, usuario_id, comentario) VALUES (?, ?, ?)';
    
    conexion.query(query, [publicacion_id, usuario_id, comentario], (err, result) => {
        if (err) {
            console.error('Error al guardar comentario:', err);
            return res.status(500).json({ error: 'Error al guardar el comentario' });
        }
        res.status(200).json({ message: 'Comentario guardado exitosamente' });
    });
});

module.exports = router;