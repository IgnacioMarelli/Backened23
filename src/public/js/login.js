async function login(event) {
    const password = document.getElementById('form-password').value;
    const email = document.getElementById('form-email').value;
    
    event.preventDefault();
    api.post('/api/session/login', {
        email,
        password
        })
        .then((data) => {
            if (!data) {
                alert('No existe el usuario.');
                return;
            }
            
            Swal.fire({
                title: `Bienvenido ${data.first_name} ${data.last_name}.`,
                text: `Tu edad es: ${data.age}.\nTu correo es: ${data.email}`,
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, soy yo'
            }).then((result) => {
                if (result.isConfirmed) {
                    location.href = 'http://localhost:8080/api/products';
                } else {
                    api.post("/api/session/auth/logout");
                }
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }