function changeRole(userID, role) {
    api.post(`/api/users/premium/${userID}`, {role})
      .then(response => {
        if (response.status === 403) {
          Swal.fire({
            title: 'Error',
            text: 'Debe subir Identificación, Comprobante de domicilio, Comprobante de estado de cuenta.',
            icon: 'error'
          });
        }
        if(response.ok){
        Swal.fire({
          title: `Ya cambió su rol de usuario.`,
          icon: 'success'
        }).then(() => {
          location.href = 'http://localhost:8080/api/products';
        });}else{
          Swal.fire({
            title: 'Error',
            text: 'Se produjo un error en la solicitud.',
            icon: 'error'
          });
        }
      })
      .catch(error => {
        Swal.fire({
          title: 'Error',
          text: 'Se produjo un error en la solicitud.',
          icon: 'error'
        });
      });
  }
  async function removeUser(id){
    let isDelete = confirm(`Estas seguro de eliminar el producto con id: ${id}?`);
    if(isDelete){
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
                headers: {},
            })

            if(!response.ok){
              Swal.fire({
                title: 'Error',
                text: 'Se produjo un error en la solicitud.',
                icon: 'error'
              });
            }
            location.reload();

        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Se produjo un error en la solicitud.',
                icon: 'error'
              });
        }
    }
}
async function removeUsers(){
  let isDelete = confirm(`Estas seguro de eliminar todos los usuarios con conexión anterior a 2 días?`);
  if(isDelete){
      try {
          const response = await fetch(`/api/users/`, {
              method: 'DELETE',
              headers: {},
          })

          if(!response.ok){
            Swal.fire({
              title: 'Error',
              text: 'Se produjo un error en la solicitud.',
              icon: 'error'
            });
          }
          location.reload();

      } catch (error) {
          Swal.fire({
              title: 'Error',
              text: 'Se produjo un error en la solicitud.',
              icon: 'error'
            });
      }
  }
}