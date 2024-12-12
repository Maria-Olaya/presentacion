const express = require('express');
const router = express.Router();
const conexion = require('../dababase/database');
const upload = require('../config/multerConfig');
const verificarAutenticacion = require('../middlewares/authMiddleware'); // Importa el middleware


// Ruta para crear una nueva historia
router.post('/historias', upload.single('archivo'), (req, res) => {
    const { contenido, expira } = req.body;
    const usuarioId = req.session.userId;

    // Validación de datos
    if (!contenido || !expira || !usuarioId) {
        return res.status(400).send('Contenido, expiración y usuario son obligatorios.');
    }

    // Si hay archivo, se guarda su ruta relativa; si no, se almacena null
    const archivo = req.file ? `uploads/${req.file.filename}` : null;

    const query = 'INSERT INTO historias (usuario_id, contenido, archivo, expira) VALUES (?, ?, ?, ?)';
    conexion.query(query, [usuarioId, contenido, archivo, expira], (err, results) => {
        if (err) {
            console.error('Error al crear la historia:', err);
            return res.status(500).send('Error al crear la historia');
        }
        res.redirect('/feed.html'); // Redirigir a la página de historias después de agregar
    });
});


// Ruta para obtener todas las historias
router.get('/historias', (req, res) => {
    const query = `
        SELECT h.*, u.nombre_usuario, u.foto_perfil 
        FROM historias h 
        JOIN usuarios u ON h.usuario_id = u.id
        WHERE h.expira > NOW()
        ORDER BY h.fecha_publicacion DESC
    `;

    conexion.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener historias:', err);
            return res.status(500).json({ error: 'Error al obtener historias' });
        }
       // console.log('Resultados de historias:', results); // Agregado para depuración
        res.json(results);
    });
});


module.exports = router;