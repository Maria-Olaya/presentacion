
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
        const tipo = window.tipoPublicacion;

        if (tipo === 'grupo') {
            const idGrupo = window.idGrupo; 
            await cargarPublicacionesGrupo(idGrupo); 
        } else if (tipo === 'reto') {
            await cargarPublicacionesReto(); 
        } else {
            await cargarPublicacionesGenerales(); 
        }
    } catch (error) {
        console.error('Error al cargar las publicaciones:', error);
    }
}



async function cargarPublicacionesGrupo(idGrupo) {
    try {
        const response = await fetch(`/grupos/${idGrupo}/publicaciones`); 
        const publicaciones = await response.json();

        const lista = document.getElementById('lista-publicaciones');
        lista.innerHTML = '';

        publicaciones.forEach(publicacion => {
            if (publicacion.tipo_publicacion === 'grupo') { 
                const div = document.createElement('div');
                div.className = 'publicacion';
                div.innerHTML = contenidoBase(publicacion); 
                lista.appendChild(div);
                cargarReaccion(publicacion.id); 
            }
        });

    } catch (error) {
        console.error('Error al cargar las publicaciones del grupo:', error);
    }
}
async function cargarPublicacionesReto() {
    try {
        const response = await fetch('/publicaciones');
        const publicaciones = await response.json();

        const lista = document.getElementById('lista-publicaciones');
        lista.innerHTML = '';

        publicaciones.forEach(publicacion => {
            if (publicacion.tipo_publicacion === 'reto') {
                const div = document.createElement('div');
                div.className = 'publicacion';
                div.innerHTML = contenidoBase(publicacion) + contenidoRespuestas(publicacion); 
                lista.appendChild(div);
                cargarReaccion(publicacion.id); 
                cargarRespuestas(publicacion.id); 
            }
        });

    } catch (error) {
        console.error('Error al cargar las publicaciones de reto:', error);
    }
}
async function cargarPublicacionesGenerales() {
    try {
        const response = await fetch('/publicaciones'); 
        const publicaciones = await response.json();

        const lista = document.getElementById('lista-publicaciones');
        lista.innerHTML = '';

        publicaciones.forEach(publicacion => {
            if (publicacion.tipo_publicacion === 'general') { 
                const div = document.createElement('div');
                div.className = 'publicacion';
                div.innerHTML = contenidoBase(publicacion);
                lista.appendChild(div);
                cargarReaccion(publicacion.id); 
            }
        });

    } catch (error) {
        console.error('Error al cargar las publicaciones generales:', error);
    }
}


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
            const archivosDiv = document.getElementById(`archivosRespuesta_${publicacionId}`);
            archivosDiv.innerHTML += renderArchivo(respuesta.archivo); 
        } else {
            console.error('Error al enviar respuesta:', response.status);
        }
    } catch (error) {
        console.error('Error al enviar respuesta:', error);
    }
}



cargarPublicaciones();


