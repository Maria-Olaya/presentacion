
    window.tipoPublicacion = sessionStorage.getItem('tipoPublicacion') || 'general';
    window.idGrupo = sessionStorage.getItem('grupoId'); 
    document.getElementById('tipo_publicacion').value = window.tipoPublicacion; 
    if (window.tipoPublicacion === 'grupo') {
        document.getElementById('grupo_id').value = window.idGrupo; 
    }

    document.getElementById('formNuevaPublicacion').addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        
        document.getElementById('tipo_publicacion').value = window.tipoPublicacion;

        try {
            const response = await fetch('/publicaciones', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Publicación creada exitosamente');
                window.history.back(); 
            } else {
                alert('Error al crear la publicación');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al crear la publicación');
        }
    });

    document.getElementById('cancelar').addEventListener('click', () => {
        window.history.back();
        cargarPublicaciones(); 
    });
