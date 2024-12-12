
    let historias = [];
    let historiaActual = 0;

    async function cargarHistorias() {
        try {
            const response = await fetch('/historias');
            if (!response.ok) {
                throw new Error('Error al cargar las historias');
            }
            historias = await response.json();
            mostrarHistorias();
        } catch (error) {
            console.error('Error al cargar historias:', error);
        }
    }

    function mostrarHistorias() {
        const contenedor = document.getElementById('historias');
        contenedor.innerHTML = ''; 

        historias.forEach((historia, index) => {
            const historiaDiv = document.createElement('div');
            historiaDiv.className = 'historia';
            historiaDiv.onclick = () => abrirHistoria(index);
            historiaDiv.innerHTML = `
                <div class="preview">
                    <img src="${historia.foto_perfil}" alt="${historia.nombre_usuario}" class="usuario-perfil">
                    <span>${historia.nombre_usuario}</span>
                </div>
            `;
            contenedor.appendChild(historiaDiv);
        });
    }

    function abrirHistoria(index) {
        historiaActual = index;
        mostrarHistoriaCompleta(index);
        document.getElementById('pantallaCompleta').style.display = 'flex'; 
    }

    function mostrarHistoriaCompleta(index) {
        const historia = historias[index];
        document.getElementById('nombreUsuarioCompleto').textContent = historia.nombre_usuario;
        document.getElementById('perfilCompleto').src = historia.foto_perfil;

        const textoCompleto = document.getElementById('textoCompleto');
        textoCompleto.innerHTML = '';

        const archivoContenedor = document.createElement('div');
        archivoContenedor.className = 'archivo-completo';

        if (historia.archivo) {
            if (historia.archivo.endsWith('.jpg') || historia.archivo.endsWith('.png') || historia.archivo.endsWith('.jpeg')) {
                archivoContenedor.innerHTML = `<img src="${historia.archivo}" alt="Historia" class="archivo-img">`;
            } else if (historia.archivo.endsWith('.mp4')) {
                archivoContenedor.innerHTML = `<video controls class="archivo-video"><source src="${historia.archivo}" type="video/mp4"></video>`;
            }
        }

        textoCompleto.appendChild(archivoContenedor); 
        textoCompleto.innerHTML += historia.contenido; 
    }

    function cerrarHistoria() {
        document.getElementById('pantallaCompleta').style.display = 'none';
    }

    function agregarHistoria() {
        window.location.href = 'agregarhistoria.html'; 
    }

    cargarHistorias();
    cargarPublicaciones();

    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            window.location.reload(); 
        }
    });












    