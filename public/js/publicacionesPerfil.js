async function cargarPublicacionesGenerales(userId) {
    try {
        const response = await fetch(`/api/publicaciones/general/${userId}`);
        const publicaciones = await response.json();

        const lista = document.getElementById('lista-publicaciones');
        lista.innerHTML = ''; 
        publicaciones.forEach(publicacion => {
            const div = document.createElement('div');
            div.className = 'publicacion';
            div.innerHTML = `
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
            lista.appendChild(div);
            cargarReaccion(publicacion.id);
        });
    } catch (error) {
        console.error('Error al cargar las publicaciones generales:', error);
    }
}

const userId = window.userId; 
cargarPublicacionesGenerales(userId);

function renderArchivo(archivo) {
    const extension = archivo.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
        return `<img src="/uploads/${archivo}" alt="Imagen" class="imagen-publicacion" />`;
    } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
        return `<video controls class="video-publicacion"><source src="/uploads/${archivo}" type="video/${extension}">Tu navegador no soporta el video.</video>`;
    } else {
        return `<a href="/uploads/${archivo}" target="_blank">Descargar ${archivo}</a>`;
    }
}