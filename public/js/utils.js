// Función para renderizar archivos (imágenes, videos y otros)
function renderArchivo(archivo) {
    const extension = archivo.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
        return `<img src="/uploads/${archivo}" alt="Imagen" class="imagen-publicacion" />`;
    } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
        return `<video controls class="video-publicacion"><source src="/uploads/${archivo}" type="video/${extension}">Tu navegador no soporta el video.</video>`;
    } else {
        // Para otros archivos, proporcionar un enlace de descarga
        return `<a href="/uploads/${archivo}" target="_blank">Descargar ${archivo}</a>`;
    }
}

// Función para agregar respuesta y renderizar el archivo correspondiente
async function enviarRespuesta(event, publicacionId) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    try {
        const response = await fetch(`/publicaciones/${publicacionId}/respuestas`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const respuesta = await response.json();
            // Renderizar archivo en la respuesta si existe
            const archivosDiv = document.getElementById(`archivosRespuesta_${publicacionId}`);
            archivosDiv.innerHTML += renderArchivo(respuesta.archivo); // Mostrar el archivo de la nueva respuesta
            // Aquí también puedes añadir la lógica para mostrar la respuesta en la lista de respuestas
        } else {
            console.error('Error al enviar respuesta:', response.status);
        }
    } catch (error) {
        console.error('Error al enviar respuesta:', error);
    }
}