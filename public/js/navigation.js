import { Decorador } from './class/Decorador.js';
async function cargarNavegacion() {
    try {
        const response = await fetch('navTemplate.html');
        if (!response.ok) {
            throw new Error('Error al cargar la navegación');
        }
        const navHtml = await response.text();
        document.getElementById('navContainer').innerHTML = navHtml;
        obtenerIdDeSesion(); 
    } catch (error) {
        console.error('Error:', error);
    }
}

const decorador = new Decorador(cargarPublicaciones);
decorador.ejecutar();
function establecerEnlacePerfilPorId(userId) {
    const perfilLink = document.getElementById('perfilLink');
    perfilLink.href = `perfil.html?id=${userId}`; 
}

async function obtenerIdDeSesion() {
    try {
        const response = await fetch('/obtenerUsuario');
        if (!response.ok) {
            throw new Error('Error al obtener el ID del usuario');
        }
        const data = await response.json();
        establecerEnlacePerfilPorId(data.userId); 
    } catch (error) {
        console.error('Error:', error);
    }
}

cargarNavegacion();
