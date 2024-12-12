function toggleRespuestas(retoId) {
    const respuestasDiv = document.getElementById(`respuestasLista_${retoId}`);
    if (respuestasDiv.style.display === 'none' || respuestasDiv.style.display === '') {
        respuestasDiv.style.display = 'block';
        respuestasDiv.style.maxHeight = '500px'; 
        cargarRespuestas(retoId);
    } else {
        respuestasDiv.style.maxHeight = '0px'; 
        setTimeout(() => { respuestasDiv.style.display = 'none'; }, 300); 
    }
}


function cargarRespuestas(retoId) {
    fetch(`/respuestas_retos/${retoId}`)
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => new Date(b.fecha_respuesta) - new Date(a.fecha_respuesta));

            const listaRespuestas = document.getElementById(`listaRespuestas_${retoId}`);
            listaRespuestas.innerHTML = '';
            data.forEach(respuesta => {
                const li = document.createElement('li');
                const fechaFormateada = new Date(respuesta.fecha_respuesta).toLocaleString();
                const archivoHTML = respuesta.archivo ? renderArchivo(respuesta.archivo) : ''; 
                
                li.innerHTML = `
                    <span class="usuario">${respuesta.nombre_usuario}</span>: 
                    ${respuesta.contenido} 
                    <span class="fecha">${fechaFormateada}</span>
                    ${archivoHTML}
                `;
                listaRespuestas.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error al cargar respuestas:', error);
        });
}



function enviarRespuesta(event, retoId) {
    event.preventDefault();
    const respuestaInput = document.getElementById(`respuesta_${retoId}`);
    const archivoInput = document.getElementById(`archivo_${retoId}`);
    const contenido = respuestaInput.value;
    const formData = new FormData(); 

    if (contenido.trim() === '') {
        alert('La respuesta no puede estar vacía');
        return;
    }

    formData.append('reto_id', retoId);
    formData.append('contenido', contenido);
    if (archivoInput.files.length > 0) {
        formData.append('archivo', archivoInput.files[0]);
    }

    fetch('/respuestas_retos', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al enviar respuesta');
        }
        return response.json();
    })
    .then(() => {
        cargarRespuestas(retoId);
        respuestaInput.value = ''; 
        archivoInput.value = ''; 
    })
    .catch(error => {
        console.error('Error al enviar respuesta:', error);
    });
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