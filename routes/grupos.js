const express = require('express');
const router = express.Router();
const conexion = require('../dababase/database');
const verificarAutenticacion = require('../middlewares/authMiddleware');


// Ruta para obtener todos los grupos
router.get('/grupos', verificarAutenticacion, (req, res) => {
    const usuario_id = req.session.userId;

    const query = `
        SELECT g.*, 
        (SELECT COUNT(*) FROM miembros_grupo WHERE grupo_id = g.id AND usuario_id = ?) AS unido
        FROM grupos_interes g
        ORDER BY fecha_creacion DESC`;

    conexion.query(query, [usuario_id], (err, results) => {
        if (err) {
            console.error('Error al obtener los grupos:', err);
            return res.status(500).json({ error: 'Error al obtener los grupos' });
        }
        res.json(results);
    });
});


// Ruta para unirse a un grupo
router.post('/unirse_grupo', verificarAutenticacion, (req, res) => {
    const { grupo_id } = req.body; // No necesitas usuario_id del cuerpo, lo obtendrás de la sesión
    const fecha_union = new Date();
    const usuario_id = req.session.userId; // Obtener ID del usuario desde la sesión

    // Verificar que el grupo_id no sea null o undefined
    if (!grupo_id) {
        return res.status(400).json({ error: 'Falta el ID del grupo' });
    }

    const query = 'INSERT INTO miembros_grupo (grupo_id, usuario_id, fecha_union) VALUES (?, ?, ?)';
    
    conexion.query(query, [grupo_id, usuario_id, fecha_union], (err, results) => {
        if (err) {
            console.error('Error al unirse al grupo:', err);
            return res.status(500).json({ error: 'Error al unirse al grupo' });
        }
        res.status(201).json({ message: 'Unido al grupo con éxito' });
    });
});


// Ruta para dejar un grupo
router.post('/dejar_grupo', (req, res) => {
    const { grupo_id } = req.body;
    const usuario_id = req.session.userId; // Obtener ID del usuario desde la sesión

    const query = 'DELETE FROM miembros_grupo WHERE grupo_id = ? AND usuario_id = ?';
    conexion.query(query, [grupo_id, usuario_id], (err, results) => {
        if (err) {
            console.error('Error al dejar el grupo:', err);
            return res.status(500).json({ error: 'Error al dejar el grupo' });
        }
        res.status(200).json({ message: 'Has dejado el grupo con éxito' });
    });
});

// Ruta para crear un grupo
router.post('/grupos', verificarAutenticacion, (req, res) => {
    const { nombre_grupo, descripcion } = req.body; // Cambié 'descripcion_grupo' a 'descripcion'
    const usuario_id = req.session.userId; // Obtener el ID del usuario desde la sesión

    // Verificar que los campos no estén vacíos
    if (!nombre_grupo || !descripcion) {
        return res.status(400).json({ error: 'El nombre y la descripción del grupo son obligatorios.' });
    }

    // Consulta SQL para insertar un nuevo grupo
    const query = `
        INSERT INTO grupos_interes (nombre_grupo, descripcion, creador_id, fecha_creacion)
        VALUES (?, ?, ?, NOW())
    `; // Cambié 'grupos' a 'grupos_interes' y 'usuario_id_creador' a 'creador_id'

    // Ejecutar la consulta
    conexion.query(query, [nombre_grupo, descripcion, usuario_id], (err, result) => {
        if (err) {
            console.error('Error al crear el grupo:', err);
            return res.status(500).json({ error: 'Error al crear el grupo' });
        }
        res.status(200).json({ message: 'Grupo creado exitosamente', grupo_id: result.insertId });
    });
});

router.get('/grupos/:idGrupo/publicaciones', verificarAutenticacion, (req, res) => {
    const idGrupo = req.params.idGrupo; // Obtener el ID del grupo desde los parámetros de la URL
    
    const query = `
        SELECT p.*, u.nombre_usuario, u.foto_perfil 
        FROM publicaciones p 
        JOIN usuarios u ON p.usuario_id = u.id 
        WHERE p.grupo_id = ?
        ORDER BY p.fecha_publicacion DESC
    `;
    
    conexion.query(query, [idGrupo], (err, results) => {
        if (err) {
            console.error('Error al obtener publicaciones del grupo:', err);
            return res.status(500).json({ error: 'Error al obtener publicaciones del grupo' });
        }
        res.json(results);
    });
});




module.exports = router;
