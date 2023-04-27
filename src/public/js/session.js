async function send(event) {
    const name = document.getElementById('form-name').value;
    const lastname = document.getElementById('form-last-name').value;
    const email = document.getElementById('form-email').value;
    const age = document.getElementById('form-edad').value;
    const password = document.getElementById('form-password').value;
    event.preventDefault();       
    api.post('/session/register', {
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