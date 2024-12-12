const express = require('express');
const router = express.Router();
const conexion = require('../dababase/database');
const upload = require('../config/multerConfig');
const verificarAutenticacion = require('../middlewares/authMiddleware'); // Importa el middleware

// Ruta para obtener historias
router.get('/historias/:usuarioId', verificarAutenticacion, (req, res) => {
    const usuarioId = req.params.usuarioId;

    const query = `
        SELECT h.*, u.nombre_usuario, u.foto_perfil 
        FROM historias h 
        JOIN usuarios u ON h.usuario_id = u.id 
        WHERE h.usuario_id = ? AND h.fecha_expiracion > NOW()
        ORDER BY h.fecha_creacion DESC
    `;

    conexion.query(query, [usuarioId], (err, results) => {
        if (err) {
            console.error('Error al obtener las historias:', err);
            return res.status(500).json({ error: 'Error al obtener las historias' });
        }
        res.json(results);
    });
});


// Ruta para obtener las publicaciones de tipo general de un usuario
router.get('/api/publicaciones/general/:usuarioId', verificarAutenticacion, (req, res) => {
    const usuarioId = req.params.usuarioId;

    const query = `
        SELECT p.*, u.nombre_usuario, u.foto_perfil 
        FROM publicaciones p 
        JOIN usuarios u ON p.usuario_id = u.id 
        WHERE p.usuario_id = ? AND p.tipo_publicacion = 'general'
        ORDER BY p.fecha_publicacion DESC
    `;

    conexion.query(query, [usuarioId], (err, results) => {
        if (err) {
            console.error('Error al obtener las publicaciones generales:', err);
            return res.status(500).json({ error: 'Error al obtener las publicaciones generales' });
        }
        res.json(results);
    });
});

//optener la cantidad de seguidores
router.get('/usuarios/:usuarioId/seguidores/cantidad', verificarAutenticacion, (req, res) => {
    const usuarioId = req.params.usuarioId;

    const query = 'SELECT COUNT(*) AS cantidad_seguidores FROM seguidores WHERE seguido_id = ?';
    conexion.query(query, [usuarioId], (err, results) => {
        if (err) {
            console.error('Error al obtener la cantidad de seguidores:', err);
            return res.status(500).json({ error: 'Error al obtener la cantidad de seguidores' });
        }
        res.json(results[0]);
    });
});

//obtener la cantidad de seguidos
router.get('/usuarios/:usuarioId/seguidos/cantidad', verificarAutenticacion, (req, res) => {
    const usuarioId = req.params.usuarioId;

    const query = 'SELECT COUNT(*) AS cantidad_seguidos FROM seguidores WHERE seguidor_id = ?';
    conexion.query(query, [usuarioId], (err, results) => {
        if (err) {
            console.error('Error al obtener la cantidad de seguidos:', err);
            return res.status(500).json({ error: 'Error al obtener la cantidad de seguidos' });
        }
        res.json(results[0]);
    });
});

//optener la lista de seguidores
router.get('/usuarios/:usuarioId/seguidores', verificarAutenticacion, (req, res) => {
    const usuarioId = req.params.usuarioId;

    const query = `
        SELECT u.id, u.nombre_usuario, u.foto_perfil 
        FROM seguidores s 
        JOIN usuarios u ON s.seguidor_id = u.id 
        WHERE s.seguido_id = ?`;

    conexion.query(query, [usuarioId], (err, results) => {
        if (err) {
            console.error('Error al obtener la lista de seguidores:', err);
            return res.status(500).json({ error: 'Error al obtener la lista de seguidores' });
        }
        res.json(results);
    });
});

//obtener la lista de seguidos
router.get('/usuarios/:usuarioId/seguidos', verificarAutenticacion, (req, res) => {
    const usuarioId = req.params.usuarioId;

    const query = `
        SELECT u.id, u.nombre_usuario, u.foto_perfil 
        FROM seguidores s 
        JOIN usuarios u ON s.seguido_id = u.id 
        WHERE s.seguidor_id = ?`;

    conexion.query(query, [usuarioId], (err, results) => {
        if (err) {
            console.error('Error al obtener la lista de seguidos:', err);
            return res.status(500).json({ error: 'Error al obtener la lista de seguidos' });
        }
        res.json(results);
    });
});

//obtener la informacion del usuario
router.get('/usuarios/:usuarioId', verificarAutenticacion, (req, res) => {
    const usuarioId = req.params.usuarioId;

    const query = `
        SELECT id, nombre, nombre_usuario, email, foto_perfil, descripcion, estado, fecha_registro, fecha_nacimiento, genero 
        FROM usuarios 
        WHERE id = ?`;

    conexion.query(query, [usuarioId], (err, result) => {
        if (err) {
            console.error('Error al obtener la información del usuario:', err);
            return res.status(500).json({ error: 'Error al obtener la información del usuario' });
        }
        res.json(result[0]);
    });
});
router.get('/obtenerUsuario', verificarAutenticacion, (req, res) => {
    res.json({ userId: req.session.userId });
});

module.exports = router;
