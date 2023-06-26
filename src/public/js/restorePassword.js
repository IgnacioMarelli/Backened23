async function restore(event) {
    event.preventDefault();
    const email = document.getElementById('form-email').value;
    api.post('/api/session/restorePassword', {email})
        .then((data) => {
            if (!data) {
                alert('No existe el usuario.');
                return;
            }
            
            Swal.fire({
                title: `Restablecimiento de contraseña.`,
                text: `Se ha enviado un mensaje para restablecerla a tu correo`,
                icon: 'success'
            }).then(() => {
                    location.href = 'http://localhost:8080//apisession/login';
            });
        })
        .catch((error) => {
            console.error(error);
        });
    }