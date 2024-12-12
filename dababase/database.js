const mysql = require('mysql2');

const conexion = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',      
    password: '',       
    database: 'presentacion'
});

conexion.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
        setTimeout(() => conexion.connect(), 2000);  // Intentar reconectar cada 2 segundos
        return;
    }
    console.log('Conexión exitosa a la base de datos.');
});

// Reconectar si la conexión se cierra
conexion.on('error', (err) => {
    console.error('Error en la conexión a la base de datos:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        conexion.connect();  // Intentar reconectar
    } else {
        throw err;
    }
});

module.exports = conexion;
