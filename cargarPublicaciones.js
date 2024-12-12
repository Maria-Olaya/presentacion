



function contenidoBase(publicacion) {
    return `
        <div class="perfil">
            <img src="${publicacion.foto_perfil}" alt="Foto de perfil de ${publicacion.nombre_usuario}" class="foto-perfil">
            <strong>${publicacion.nombre_usuario}</strong>
        </div>
        <p class="contenido">${publicacion.contenido}</p>
        ${publicacion.archivo ? `
            <div class="archivo">
                ${renderArchivo(publicacion.archivo)}
            </div>` : ''
        }
        <p><small>Publicado el: ${new Date(publicacion.fecha_publicacion).toLocaleString()}</small></p>
        
        <button onclick="toggleReacciones(${publicacion.id})" id="boton_reaccion_${publicacion.id}">😶</button>
        <div class="reacciones" id="reacciones_${publicacion.id}">
            <button onclick="reaccionar(${publicacion.id}, 'me encanta')">😍 Me Encanta</button>
            <button onclick="reaccionar(${publicacion.id}, 'me sorprende')">😮 Me Sorprende</button>
            <button onclick="reaccionar(${publicacion.id}, 'me enoja')">😡 Me Enoja</button>
            <button onclick="reaccionar(${publicacion.id}, 'me entristece')">😢 Me Entristece</button>
            <button onclick="reaccionar(${publicacion.id}, 'me gusta')">👍 Me Gusta</button>
            <span id="reaccion_actual_${publicacion.id}" style="display: none;"></span>
        </div>

        <div class="comentarios" id="comentarios_${publicacion.id}">
            <h2>Comentarios</h2>
            <button id="toggleComentarios_${publicacion.id}" onclick="toggleComentarios(${publicacion.id})">Comentarios</button>
            <div id="comentariosLista_${publicacion.id}" style="display: none;">
                <div class="comentarios-container" style="max-height: 200px; overflow-y: auto;">
                    <ul id="listaComentarios_${publicacion.id}"></ul>
                </div>
                <form id="formComentario_${publicacion.id}" onsubmit="enviarComentario(event, ${publicacion.id})">
                    <textarea id="comentario_${publicacion.id}" name="comentario" placeholder="Escribe un comentario..."></textarea>
                    <button type="submit">Agregar comentario</button>
                </form>
            </div>
        </div>
    `;
}


function contenidoRespuestas(publicacion) {
  
    return `
        <div class="respuestas" id="respuestas_${publicacion.id}">
            <h2>Respuestas</h2>
            <button id="toggleRespuestas_${publicacion.id}" onclick="toggleRespuestas(${publicacion.id})">Respuestas</button>
            <div id="respuestasLista_${publicacion.id}" style="display: none;">
                <div class="respuestas-container" style="max-height: 200px; overflow-y: auto;">
                    <ul id="listaRespuestas_${publicacion.id}"></ul>
                </div>
                <form id="formRespuesta_${publicacion.id}" onsubmit="enviarRespuesta(event, ${publicacion.id})">
                    <input type="text" id="respuesta_${publicacion.id}" placeholder="Escribe una respuesta..." required />
                    <input type="file" id="archivo_${publicacion.id}" accept="*" /> <!-- Aceptar cualquier archivo -->
                    <button type="submit">Agregar respuesta</button>
                </form>
                <div class="respuesta-archivos" id="archivosRespuesta_${publicacion.id}"></div>
            </div>
        </div>
    `;
}





async function cargarPublicaciones() {
    try {
        const tipo = window.tipoPublicacion; // Obtener el tipo de publicación del contexto

        if (tipo === 'grupo') {
            const idGrupo = window.idGrupo; // Obtener el ID del grupo si aplica
            await cargarPublicacionesGrupo(idGrupo); // Cargar publicaciones de grupo
        } else if (tipo === 'reto') {
            await cargarPublicacionesReto(); // Cargar publicaciones de reto
        } else {
            await cargarPublicacionesGenerales(); // Cargar publicaciones generales
        }
    } catch (error) {
        console.error('Error al cargar las publicaciones:', error);
    }
}



async function cargarPublicacionesGrupo(idGrupo) {
    try {
        const response = await fetch(`/grupos/${idGrupo}/publicaciones`); // Llama a la API de publicaciones de grupo
        const publicaciones = await response.json();

        const lista = document.getElementById('lista-publicaciones');
        lista.innerHTML = '';

        publicaciones.forEach(publicacion => {
            if (publicacion.tipo_publicacion === 'grupo') { // Filtrar por tipo
                const div = document.createElement('div');
                div.className = 'publicacion';
                div.innerHTML = contenidoBase(publicacion); // Usa la función de contenido base
                lista.appendChild(div);
                cargarReaccion(publicacion.id); // Cargar las reacciones
            }
        });

    } catch (error) {
        console.error('Error al cargar las publicaciones del grupo:', error);
    }
}
async function cargarPublicacionesReto() {
    try {
        const response = await fetch('/publicaciones'); // Llama a la API general de publicaciones
        const publicaciones = await response.json();

        const lista = document.getElementById('lista-publicaciones');
        lista.innerHTML = '';

        publicaciones.forEach(publicacion => {
            if (publicacion.tipo_publicacion === 'reto') { // Filtrar por tipo
                const div = document.createElement('div');
                div.className = 'publicacion';
                div.innerHTML = contenidoBase(publicacion) + contenidoRespuestas(publicacion); // Usa la función de respuestas
                lista.appendChild(div);
                cargarReaccion(publicacion.id); // Cargar las reacciones
                cargarRespuestas(publicacion.id); // Cargar las respuestas
            }
        });

    } catch (error) {
        console.error('Error al cargar las publicaciones de reto:', error);
    }
}
async function cargarPublicacionesGenerales() {
    try {
        const response = await fetch('/publicaciones'); // Llama a la API general de publicaciones
        const publicaciones = await response.json();

        const lista = document.getElementById('lista-publicaciones');
        lista.innerHTML = '';

        publicaciones.forEach(publicacion => {
            if (publicacion.tipo_publicacion === 'general') { // Filtrar por tipo
                const div = document.createElement('div');
                div.className = 'publicacion';
                div.innerHTML = contenidoBase(publicacion); // Usa la función de contenido base
                lista.appendChild(div);
                cargarReaccion(publicacion.id); // Cargar las reacciones
            }
        });

    } catch (error) {
        console.error('Error al cargar las publicaciones generales:', error);
    }
}








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











// Cargar publicaciones al inicio
cargarPublicaciones();



