
function logout() { api.post("/api/users/auth/logout"); }

async function docs(event, userId) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
        try {            
          const response = await api.postProd(`/api/users/${userId}/documents`, formData);
          if (!response.ok) {
            throw new Error('Error en la solicitud');
          } else {
            Swal.fire({
              title: 'Subido',
              text: 'Se subió exitosamente el archivo.',
              icon: 'success'
            });
          }
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al subir el archivo',
            icon: 'error'
          });
        }
      }; 
