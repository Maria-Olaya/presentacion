
window.tipoPublicacion = 'grupo';

document.getElementById('linkNuevaReto').addEventListener('click', () => {
    sessionStorage.setItem('tipoPublicacion', window.tipoPublicacion); 
});

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload(); 
    }
});

async function cargarGrupos() {
    try {
        const response = await fetch('/grupos'); 
        const grupos = await response.json(); 
        const grupoContainer = document.getElementById('grupoContainer'); 

        grupos.forEach(grupo => {
            const grupoDiv = document.createElement('div');
            grupoDiv.className = 'grupo';
            grupoDiv.innerHTML = `
                <h3>${grupo.nombre_grupo}</h3>
                <p>${grupo.descripcion}</p>
                <button class="btn-unir" id="btn-${grupo.id}" onclick="toggleGrupo(${grupo.id}, event)">
                    ${grupo.unido > 0 ? 'Unido' : 'Unirse al grupo'}
                </button>
            `;

            grupoDiv.addEventListener('click', function() {
                window.location.href = `feedGrupo.html?grupoId=${grupo.id}`;
            });

            grupoContainer.appendChild(grupoDiv); 
        });
    } catch (error) {
        console.error('Error al cargar grupos:', error);
    }
}

cargarGrupos();

function toggleGrupo(grupoId, event) {
    event.stopPropagation(); 

    const button = document.getElementById(`btn-${grupoId}`);
    
    if (button.innerText === "Unirse al grupo") {
        unirseGrupo(grupoId, button);
    } else {
        dejarGrupo(grupoId, button);
    }
}


function unirseGrupo(grupoId, button) {
    fetch('/unirse_grupo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ grupo_id: grupoId }) 
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Error al unirse al grupo');
    })
    .then(data => {
        console.log(data.message); 
        button.innerText = "Unido"; 
    })
    .catch(error => {
        console.error('Error:', error); 
    });
}

function dejarGrupo(grupoId, button) {
    fetch('/dejar_grupo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ grupo_id: grupoId }) 
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Error al dejar el grupo');
    })
    .then(data => {
        console.log(data.message); 
        button.innerText = "Unirse al grupo"; 
    })
    .catch(error => {
        console.error('Error:', error); 
    });
}

