async function login(event) {
    const password = document.getElementById('form-password').value;
    const email = document.getElementById('form-email').value;
    
    event.preventDefault();
    try {
        const response = await api.post('/api/users/login', {
            email,
            password
        });
    
        if (response.ok) {
            const data = await response.json();
    
            if (!data) {
                throw new Error('Data not found');
            }
    
            const { first_name, last_name, age, email } = data;
    
            const result = await Swal.fire({
                title: `Bienvenido ${first_name} ${last_name}.`,
                text: `Tu edad es: ${age}.\nTu correo es: ${email}`,
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, soy yo'
            });
    
            if (result.isConfirmed) {
                location.href = 'http://localhost:8080/api/products';
            } else {
                await api.post("/api/users/auth/logout");
            }
        } else if(response.status===400){
            Swal.fire({
                title: 'Error',
                text: 'Error en el mail o contraseña.',
                icon: 'error'
            });
        }else{
            throw new Error('Response not OK');
        }
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: 'Se produjo un error en la solicitud.',
            icon: 'error'
        });
    }
}    