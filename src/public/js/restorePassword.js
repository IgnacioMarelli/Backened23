async function restore(event) {
    event.preventDefault();
    const email = document.getElementById('form-email').value;
    api.post('/api/users/restorePassword', {email})
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
                    location.href = 'https://backened23-production.up.railway.app/api/users/login';
            });
        })
        .catch((error) => {
            Swal.fire({
                title: `Error al restablecer contraseña`,
                icon: 'error'
            })    
        });
    }