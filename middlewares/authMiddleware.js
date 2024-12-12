function verificarAutenticacion(req, res, next) {
    if (!req.session.userId) {
        console.log('Usuario no autenticado. ID de usuario no encontrado en la sesión.');
        return res.status(401).send('No estás autorizado. Por favor inicia sesión.');
    }
    next();
}

module.exports = verificarAutenticacion;
