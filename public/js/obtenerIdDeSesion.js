
export async function obtenerIdDeSesion() {
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
