document.getElementById('formAgregarHistoria').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const formData = new FormData(this);

    fetch('/historias', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert('Historia agregada exitosamente');
            window.location.href = '/feed.html'; 
        } else {
            alert('Error al agregar la historia. Inténtalo de nuevo más tarde.');
        }
    })
    .catch(error => {
        console.error('Error al agregar la historia:', error);
        alert('Error al agregar la historia. Inténtalo de nuevo más tarde.');
    });
});
