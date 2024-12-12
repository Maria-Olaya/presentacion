function toggleComentarios(publicacionId) {
    const comentariosDiv = document.getElementById(`comentariosLista_${publicacionId}`);
    if (comentariosDiv.style.display === 'none' || comentariosDiv.style.display === '') {
        comentariosDiv.style.display = 'block';
        comentariosDiv.style.maxHeight = '500px'; 
        cargarComentarios(publicacionId);
    } else {
        comentariosDiv.style.maxHeight = '0px'; 
        setTimeout(() => { comentariosDiv.style.display = 'none'; }, 300); 
    }
}


function cargarComentarios(publicacionId) {
    fetch(`/comentarios/${publicacionId}`)
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

            const listaComentarios = document.getElementById(`listaComentarios_${publicacionId}`);
            listaComentarios.innerHTML = ''; 

            data.forEach(comentario => {
                const li = document.createElement('li');
                const fechaFormateada = new Date(comentario.fecha).toLocaleString(); 
                li.innerHTML = `<span class="usuario">${comentario.nombre_usuario}</span>: ${comentario.comentario} <span class="fecha">${fechaFormateada}</span>`;
                listaComentarios.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error al cargar comentarios:', error);
        });
}


function enviarComentario(event, publicacionId) {
    event.preventDefault();
    const comentarioInput = document.getElementById(`comentario_${publicacionId}`);
    const comentario = comentarioInput.value;

    if (comentario.trim() === '') {
        alert('El comentario no puede estar vacío');
        return;
    }

    const palabras = comentario.trim().split(/\s+/);
    if (palabras.length > 20) { 
        alert('El comentario no puede tener más de 20 palabras.');
        return;
    }

    fetch('/comentarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            comentario: comentario,
            publicacion_id: publicacionId
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al enviar comentario');
        }
        return response.json();
    })
    .then(() => {
        cargarComentarios(publicacionId);
        comentarioInput.value = ''; 
    })
    .catch(error => {
        console.error('Error al enviar comentario:', error);
    });
}

