
const form = document.getElementById('crear-grupo-form');
const messageDiv = document.getElementById('message');
const cancelarBtn = document.getElementById('cancelar-btn');

cancelarBtn.addEventListener('click', () => {
    window.location.href = 'ListaGrupos.html'; 
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = {
        nombre_grupo: formData.get('nombre_grupo'),
        descripcion: formData.get('descripcion') 
    };

    try {
        const response = await fetch('/grupos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            messageDiv.textContent = 'Grupo creado exitosamente: ' + result.message;
            messageDiv.style.color = 'green';
            form.reset();

            setTimeout(() => {
                window.location.href = 'ListaGrupos.html';
            }, 2000); 
        } else {
            messageDiv.textContent = 'Error: ' + result.error;
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        messageDiv.textContent = 'Ocurrió un error: ' + error.message;
        messageDiv.style.color = 'red';
    }
});
