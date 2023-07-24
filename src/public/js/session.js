async function send(event) {
    const first_name = document.getElementById('form-name').value;
    const last_name = document.getElementById('form-last-name').value;
    const email = document.getElementById('form-email').value;
    const phone = document.getElementById('form-phone').value;
    const age = document.getElementById('form-edad').value;
    const password = document.getElementById('form-password').value;
    event.preventDefault();       
    api.post('/api/users/register', {
        first_name,
        last_name,
        email,
        age,
        phone,
        password
    })
    .then((data) => {
        if(data){
            Swal.fire({
                title: `Registrado correctamente`,
                text: `Se ha enviado un mensaje a tu correo`,
                icon: 'success'
            }).then(() => {
                    location.href = 'https://backened23-production.up.railway.app/api/users/login';
            });
        }
    }).catch(error=>
        Swal.fire({
            title: `Error al registrarse`,
            icon: 'error'
        })    
    )
}