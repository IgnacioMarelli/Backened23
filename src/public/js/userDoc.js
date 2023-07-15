
function logout() { api.post("/api/users/auth/logout"); }

function docs(event, userId) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
        try {            
          api.postProd(`/api/users/${userId}/documents`, formData)
            .then(response => {
              if (!response.ok) {
                throw new Error('Error en la solicitud');
              } else {
                const p = document.getElementById('doc-id');
                p.insertAdjacentHTML("afterend", `<p><b>Archivo agregado correctamente</b></p>`);
              }
            })
            .catch(error => {
              const p = document.getElementById('doc-id');
              p.insertAdjacentHTML("afterend", `<p><b>Error: ${error.message}, intenta más tarde</b></p>`);
            });
        } catch (error) {
          let message = error.message || 'Ocurrió un error';
          const p = document.getElementById('doc-id');
          p.insertAdjacentHTML("afterend", `<p><b>Error: ${message}, intenta más tarde</b></p>`);
        }
      }; 
