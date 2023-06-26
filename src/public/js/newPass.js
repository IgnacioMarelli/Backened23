async function newPass(event) {
    event.preventDefault();
    const email = document.querySelector('.email').textContent;
    const newPass = document.getElementById('form-pass').value;
    api.put('/session/newPass', {email, newPass})
        .then((data) => {
            if (!data) {
                alert('No existe el usuario.');
                return;
            }
            
            Swal.fire({
                title: `Restablecimiento de contraseña.`,
                text: `Se ha restablecido la contraseña`,
                icon: 'success'
            }).then(() => {
                    location.href = 'http://localhost:8080/api/session/login';
            });
        })
        .catch((error) => {
            console.error(error);
        });
    }