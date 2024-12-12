class Navigation {
    async cargarNavegacion() {
        try {
            const response = await fetch('navTemplate.html');
            if (!response.ok) {
                throw new Error('Error al cargar la navegación');
            }
            const navHtml = await response.text();
            document.getElementById('navContainer').innerHTML = navHtml;
            this.obtenerIdDeSesion();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async obtenerIdDeSesion() {
        try {
            const response = await fetch('/obtenerUsuario');
            if (!response.ok) {
                throw new Error('Error al obtener el ID del usuario');
            }
            const data = await response.json();
            this.establecerEnlacePerfilPorId(data.userId);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    establecerEnlacePerfilPorId(userId) {
        const perfilLink = document.getElementById('perfilLink');
        perfilLink.href = `perfil.html?id=${userId}`;
    }
}
