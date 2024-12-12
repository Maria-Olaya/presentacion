function toggleReacciones(publicacionId) {
    const reaccionesDiv = document.getElementById(`reacciones_${publicacionId}`);
    const botonReaccion = document.getElementById(`boton_reaccion_${publicacionId}`);

    if (reaccionesDiv.style.display === 'none' || reaccionesDiv.style.display === '') {
        reaccionesDiv.style.display = 'block';
    } else {
        reaccionesDiv.style.display = 'none';
    }
}

function cargarReaccion(publicacionId) {
    fetch(`/reacciones/${publicacionId}`)
        .then(response => response.json())
        .then(data => {
            const emojis = {
                'me encanta': '😍',
                'me sorprende': '😮',
                'me enoja': '😡',
                'me entristece': '😢',
                'me gusta': '👍'
            };

            if (data.tipo_reaccion && emojis[data.tipo_reaccion]) {
                const emoji = emojis[data.tipo_reaccion]; 
                document.getElementById(`reaccion_actual_${publicacionId}`).innerHTML = emoji; 
                document.getElementById(`boton_reaccion_${publicacionId}`).innerHTML = emoji; 
            }
        })
        .catch(error => {
            console.error('Error al cargar la reacción:', error);
        });
}

function reaccionar(publicacionId, tipoReaccion) {
    fetch('/reacciones', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            publicacion_id: publicacionId,
            tipo_reaccion: tipoReaccion
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al registrar la reacción');
        }
        return response.json();
    })
    .then(() => {
        cargarReaccion(publicacionId); 
    })
    .catch(error => {
        console.error('Error al reaccionar:', error);
    });
}
