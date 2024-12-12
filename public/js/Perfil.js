
const params = new URLSearchParams(window.location.search);
const userId = params.get('id'); 
console.log("User ID:", userId); 

function mostrarLista(tipo) {
    const lista = document.getElementById(`lista${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
    if (lista.style.display === 'block') {
        lista.style.display = 'none'; 
    } else {
        lista.style.display = 'block';

        fetch(`/usuarios/${userId}/${tipo}`)
            .then(response => response.json())
            .then(data => {
                const listaContenido = document.getElementById(`lista${tipo.charAt(0).toUpperCase() + tipo.slice(1)}Contenido`);
                listaContenido.innerHTML = ''; 
                data.forEach(usuario => {
                    const li = document.createElement('li');
                    li.textContent = usuario.nombre_usuario;
                    listaContenido.appendChild(li);
                });
            })
            .catch(error => console.error('Error:', error));
    }
}



function obtenerPerfil() {
    fetch(`/usuarios/${userId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('nombreUsuario').textContent = data.nombre_usuario;
            document.getElementById('emailUsuario').textContent = data.email;
            document.getElementById('fotoPerfil').src = data.foto_perfil;
            document.getElementById('descripcionUsuario').textContent = data.descripcion; 
        })
        .catch(error => console.error('Error:', error));
}


function obtenerStats() {
    fetch(`/usuarios/${userId}/seguidores/cantidad`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('cantidadSeguidores').textContent = data.cantidad_seguidores;
        })
        .catch(error => console.error('Error:', error));

    fetch(`/usuarios/${userId}/seguidos/cantidad`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('cantidadSeguidos').textContent = data.cantidad_seguidos;
        })
        .catch(error => console.error('Error:', error));
}

window.onload = function() {
    obtenerPerfil();
    obtenerStats();
};





window.tipoPublicacion = 'general'; 

async function obtenerIdDeSesion() {
    try {
        const response = await fetch('/obtenerUsuario');
        if (!response.ok) {
            throw new Error('Error al obtener el ID del usuario');
        }
        const data = await response.json();
        establecerEnlacePerfilPorId(data.userId); 
    } catch (error) {
        console.error('Error:', error);
    }
}

obtenerIdDeSesion();



    cargarPublicacionesGenerales(userId);

    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            window.location.reload();
        }
    });
    
    function establecerEnlacePerfilPorId(userId) {
        const perfilLink = document.getElementById('perfilLink');
        perfilLink.href = `perfil.html?id=${userId}`; 
    }
