// publicaciones.js
const express = require('express');
const router = express.Router();
const conexion = require('../dababase/database');
const upload = require('../config/multerConfig');
const verificarAutenticacion = require('../middlewares/authMiddleware');
const { wss } = require('../app');
const path = require('path');

router.get('/publicaciones', verificarAutenticacion, (req, res) => {
    const tipo = req.query.tipo;
    const query = tipo ? 
        `SELECT p.*, u.nombre_usuario, u.foto_perfil 
         FROM publicaciones p 
         JOIN usuarios u ON p.usuario_id = u.id
         WHERE p.tipo_publicacion = ? 
         ORDER BY p.fecha_publicacion DESC` :
        `SELECT p.*, u.nombre_usuario, u.foto_perfil 
         FROM publicaciones p 
         JOIN usuarios u ON p.usuario_id = u.id
         ORDER BY p.fecha_publicacion DESC`;

    const params = tipo ? [tipo] : [];
    conexion.query(query, params, (err, results) => {
        if (err) {
            console.error('Error al obtener publicaciones:', err);
            return res.status(500).json({ error: 'Error al obtener publicaciones' });
        }
        res.json(results);
    });
});

router.post('/publicaciones', verificarAutenticacion, upload.single('archivo'), (req, res) => {
    const { contenido, grupo_id } = req.body;
    const tipo_publicacion = req.body.tipo_publicacion || 'general';
    const usuario_id = req.session.userId;
    const archivo = req.file ? req.file.filename : null;

    const query = 'INSERT INTO publicaciones (contenido, usuario_id, archivo, tipo_publicacion' + 
                  (grupo_id ? ', grupo_id' : '') + 
                  ', fecha_publicacion) VALUES (?, ?, ?, ?' + 
                  (grupo_id ? ', ?' : '') + 
                  ', NOW())';

    const params = [contenido, usuario_id, archivo, tipo_publicacion];
    if (grupo_id) {
        params.push(grupo_id);
    }

    conexion.query(query, params, (err, result) => {
        if (err) {
            console.error('Error al crear la publicación:', err);
            return res.status(500).json({ error: 'Error al crear la publicación' });
        }

       const newPost = { contenido, usuario_id, archivo, tipo_publicacion, fecha_publicacion: new Date() };
        if (wss && wss.clients) {
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ action: 'newPost', post: newPost }));
                }
            });
        }

        res.status(200).json({ message: 'Publicación creada exitosamente' });
    });
});

router.get('/nuevaPublicacion', verificarAutenticacion, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'nuevaPublicacion.html'));
});

module.exports = router;

