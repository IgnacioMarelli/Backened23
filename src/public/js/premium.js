const query = new URLSearchParams(window.location.search);


function premium(userID, role) {
    api.post(`/api/session/premium/${userID}`, role)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        Swal.fire({
          title: `Ya cambió su rol de usuario.`,
          icon: 'success'
        }).then(() => {
          location.href = 'http://localhost:8080/api/products';
        });
      })
      .catch(error => {
        console.error(error);
        Swal.fire({
          title: 'Error',
          text: 'Se produjo un error en la solicitud.',
          icon: 'error'
        });
      });
  }