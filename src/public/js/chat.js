const socket= io();
const chatBox= document.getElementById('chatBox');

let user;
Swal.fire(
    {
        title:'Chat',
        input:"text",
        text:'Ingrese nombre de usuario',
        inputValidator:(value)=>{
            return !value && '¡Necesitas escribir un nombre de usuario para contunuar'
        },
        allowOutsideClick: false
    }
).then(result=>{
    user=result.value;
    socket.emit('new_user', user);
});


chatBox.addEventListener('keyup', e=>{
    if(e.key === 'Enter'){
        if(chatBox.value.trim().length > 0){
            socket.emit('message',{
                name: user, message: chatBox.value
            });
            chatBox.value = '';
        }
    }
})
socket.on('messageLogs', data=>{
    let log= document.getElementById('message');
    let messages = data.map((message) =>
        `${message.name} : ${message.message}`
    ).join('<br />');
    log.innerHTML= messages;
})
socket.on('user', data =>{
    Swal.fire({
        text:`Se conecto ${data}`,
        toast:true,
        position:"top-right"
    })
})
