const session = require('express-session');

const sessionConfig = session({
    secret: 'tu_secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
});

module.exports = sessionConfig;
