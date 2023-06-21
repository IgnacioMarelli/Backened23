const query = new URLSearchParams(window.location.search);


function premium(userID,role) {
    api.post(`/premium/${userID}`, role)
    .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
            Swal.fire({
            title: `Ya cambio su rol de usuario.`,
            icon: 'success'
        }).then(() => {
                location.href = 'http://localhost:8080/products';
        });
      })
}