const socket= io();
async function login(event) {
    const password = document.getElementById('form-password').value;
    const email = document.getElementById('form-email').value;
    event.preventDefault();
    api.post('/api/users/login', {
        email,
        password
        })
        .then((data) => {
            if(!data._id) {
                return alert('No existe el usuario.')
            }
            Swal.fire({
                title: `Bienvenido ${data.name} ${data.lastname}.`,
                text:`Tu edad es: ${data.age}.
                Tu mail es : ${data.email}`,
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, soy yo'
              }).then((result) => {
                if (result.isConfirmed) {
                    location.href = 'http://localhost:8080/api/products';
                }else{ 
                api.post("/api/users/auth/logout")}
                  
        })
    })}
