/*const nombre = document.getElementById('form-name').value;
const apellido = document.getElementById('form-last-name').value;
const email = document.getElementById('form-email').value;
const edad = document.getElementById('form-edad').value;
const password = document.getElementById('form-password').value;

async function send(event) {
    event.preventDefault();
    api.post('/users/logins', {
    nombre,
    apellido,
    email,
    edad,
    password,
    })
    .then((d) => alert('Usuario Registrado'));
}
async function login(event) {
    event.preventDefault();
    api.post('/users', {
        email,
        password
        })
        .then((d) => alert('Usuario Registrado'));
}*/
async function send(event) {
    event.preventDefault();
    const name = document.getElementById('form-name').value;
    const lastname = document.getElementById('form-last-name').value;
    const email = document.getElementById('form-email').value;
    const age = document.getElementById('form-edad').value;
    const password = document.getElementById('form-password').value;
    
    
    api.post('/users/register', {
        name,
        lastname,
        email,
        age,
        password
    })
    .then((data) => {
        if(!data._id) {
            return alert('User already registered or incomplete data.')
        }
        alert(`User registered OK with ID ${data._id}`)
    })
}