async function send(event) {
    const first_name = document.getElementById('form-name').value;
    const last_name = document.getElementById('form-last-name').value;
    const email = document.getElementById('form-email').value;
    const age = document.getElementById('form-edad').value;
    const password = document.getElementById('form-password').value;
    event.preventDefault();       
    api.post('/session/register', {
        first_name,
        last_name,
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