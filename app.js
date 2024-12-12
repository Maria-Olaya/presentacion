// app.js
// Importa las librerías necesarias
const express = require('express');
const http = require('http'); // Importa http para crear el servidor
const WebSocket = require('ws'); // Importa WebSocket
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const conexion = require('./dababase/database'); // Importa la conexión desde el archivo

const app = express();
const PORT = 8080;

// Configura el servidor HTTP con Express
const server = http.createServer(app);

// Configura WebSocket en el servidor HTTP
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Cliente conectado');

    // Escucha los mensajes entrantes de los clientes
    ws.on('message', (message) => {
        console.log('Mensaje recibido:', message);
    });

    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

// Importa los módulos separados
const upload = require('./config/multerConfig'); // Configuración de multer
const verificarAutenticacion = require('./middlewares/authMiddleware'); // Middleware de autenticación
const sessionConfig = require('./config/sessionConfig'); // Configuración de la sesión
const usuariosRoutes = require('./routes/usuarios'); // Rutas de usuarios
const gruposRoutes = require('./routes/grupos'); // Rutas de grupos
const retosRoutes = require('./routes/retos'); // Rutas de retos
const registroRoutes = require('./routes/registro');
const iniciosesionRoutes = require('./routes/iniciosesion');

const publicacionesRoutes = require('./routes/publicaciones'); // Rutas de publicaciones
const reaccionesRoutes = require('./routes/reacciones'); // Rutas de reacciones
const comentariosRoutes = require('./routes/comentarios'); // Rutas de comentarios
const historiasRoutes = require('./routes/historias'); // Rutas de historias

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Para manejar JSON

// Middleware para manejar sesiones
app.use(sessionConfig);

// Ruta de prueba para verificar la sesión del usuario
app.get('/obtenerUsuario', verificarAutenticacion, (req, res) => {
    res.json({ userId: req.session.userId });
});

// Ruta para subir archivos
app.post('/upload', upload.single('file'), (req, res) => {
    res.send('Archivo subido exitosamente');
});

// Ruta para la página de inicio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Registra las rutas
app.use(usuariosRoutes);
app.use(gruposRoutes);
app.use(retosRoutes);
app.use(publicacionesRoutes);
app.use(reaccionesRoutes);
app.use(comentariosRoutes);
app.use(historiasRoutes);
app.use(registroRoutes);
app.use(iniciosesionRoutes);

// Inicia el servidor
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// Exporta el servidor y wss para usarlos en otros módulos
module.exports = { server, wss };
