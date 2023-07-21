async function newPass(event) {
    event.preventDefault();
    const email = document.querySelector('.email').textContent;
    const newPass = document.getElementById('form-pass').value;
    api.put('/api/users/newPass', {email, newPass})
        .then((data) => {
            if (!data) {
                alert('Error.');
                return;
            }
            
            Swal.fire({
                title: `Restablecimiento de contraseña.`,
                text: `Se ha restablecido la contraseña`,
                icon: 'success'
            }).then(() => {
                    location.href = 'http://localhost:8080/api/users/login';
            });
        })
        .catch((error) => {
            Swal.fire({
                title: 'Error',
                text: 'Se produjo un error en la solicitud.',
                icon: 'error'
              });
        });
    }