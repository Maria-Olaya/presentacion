const express = require('express');
const router = express.Router();
const conexion = require('../dababase/database');
const upload = require('../config/multerConfig');
const verificarAutenticacion = require('../middlewares/authMiddleware'); // Importa el middleware


// Ruta para subir una respuesta a un reto
router.post('/respuestas_retos', upload.single('archivo'), (req, res) => {
    const { reto_id, contenido } = req.body;
    const usuario_id = req.session.userId; // Asegúrate de que el usuario esté autenticado
    const archivo = req.file ? req.file.filename : null;

    const query = 'INSERT INTO respuestas_retos (reto_id, usuario_id, contenido, archivo, fecha_respuesta) VALUES (?, ?, ?, ?, NOW())';
    
    conexion.query(query, [reto_id, usuario_id, contenido, archivo], (err, result) => {
        if (err) {
            console.error('Error al subir la respuesta:', err);
            return res.status(500).json({ error: 'Error al subir la respuesta' });
        }
        res.status(200).json({ message: 'Respuesta subida exitosamente' });
    });
});


// Ruta para obtener respuestas a un reto específico
router.get('/respuestas_retos/:retoId', (req, res) => {
    const retoId = req.params.retoId;

    const query = `
        SELECT rr.*, u.nombre_usuario, u.foto_perfil 
        FROM respuestas_retos rr 
        JOIN usuarios u ON rr.usuario_id = u.id 
        WHERE rr.reto_id = ? 
        ORDER BY rr.fecha_respuesta DESC
    `;

    conexion.query(query, [retoId], (err, results) => {
        if (err) {
            console.error('Error al obtener respuestas:', err);
            return res.status(500).json({ error: 'Error al obtener respuestas' });
        }
        res.json(results);
    });
});


module.exports = router;
