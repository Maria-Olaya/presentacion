
  function obtenerIdGrupo() {
      const params = new URLSearchParams(window.location.search);
      return params.get('grupoId');
  }

  window.idGrupo = obtenerIdGrupo();
  sessionStorage.setItem('grupoId', window.idGrupo); 
 

  cargarPublicacionesGrupo();


  window.tipoPublicacion = 'grupo'; 




  async function cargarPublicacionesGrupo() {
      window.tipoPublicacion = 'grupo'; 
      
      window.idGrupo = obtenerIdGrupo();
      sessionStorage.setItem('grupoId', window.idGrupo); 
  
      await cargarPublicaciones(); 
  }
  

  window.addEventListener('pageshow', function(event) {
      if (event.persisted) {
          window.location.reload(); 
      }
  });
  
