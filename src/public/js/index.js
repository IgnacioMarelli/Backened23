const socket = io();
const form = document.getElementById('crud-form');
const query = new URLSearchParams(window.location.search);

async function addProd(id) {
    const cid=undefined;
    const quantity = {"quantity":32};
    try {
        const response = await fetch(`/carts/${cid}/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify({quantity:32})
        })
        if(!response.ok) {
            const p = document.getElementById('producto-id')
            p.innerText = `Error ${response.status}: ${response.statusText}`
        }else{
            const p = document.getElementById('producto-id');
            p.innerText = `Producto agregado correctamente`;
            setTimeout(() =>{
                p.innerText = ``;
                location.reload();
            }, 2000)
        }
    }catch(e){
        let message = error.statusText || 'Ocurrio un error';
        const p = document.getElementById('producto-id');
        p.insertAdjacentHTML("afterend", `<p><b>Error: ${message} intenta mas tarde</b></p>`);
    }

};
console.log(query.get()); 

let nextPage;
function setPrev() {
    const previusPage= Number(query.get('page'))-1;
    query.set('page', previusPage);
    window.location.search = query.toString();
}
function setNext() {
    if (query.get('page')) {
        nextPage= Number(query.get('page'))+1;
    }else{
        nextPage= Number(query.get('page'))+2;
    }
    query.set('page', nextPage);
    window.location.search = query.toString();
}
function sortMayor() {
    const sorts = -1;
    query.set('sort', sorts);
    window.location.search = query.toString();
}
function sortMenor() {
    const sorts = 1;
    query.set('sort', sorts);
    window.location.search = query.toString();
}
document.addEventListener('submit', async e=>{
    if(e.target === form){
        e.preventDefault()

        if(!e.target.id.value){
            const formData = new FormData;

            formData.append('title', e.target.name.value)
            formData.append('description', e.target.description.value)
            formData.append('price', e.target.price.value)
            formData.append('stock', e.target.stock.value)
            formData.append('category', e.target.category.value)
            formData.append('code', e.target.code.value)
            formData.append('file', e.target.file.files[0])

            try {
                const response = await fetch('/products', {
                    method: 'POST',
                    body: formData
                })

                if(!response.ok) {
                    const p = document.getElementById('producto-id')
                    p.innerText = `Error ${response.status}: ${response.statusText}`
                }else{
                    const p = document.getElementById('producto-id');
                    p.innerText = `Producto agregado correctamente`;
                    setTimeout(() =>{
                        p.innerText = ``;
                        location.reload();
                    }, 2000)
                }
            } catch (error) {
                let message = error.statusText || 'Ocurrio un error';
                const p = document.getElementById('producto-id');
                p.insertAdjacentHTML("afterend", `<p><b>Error: ${message} intenta mas tarde</b></p>`);
            }
        }
    }
})

document.addEventListener('click', async e =>{
    if(e.target.matches('.delete')){
        const id = e.target.parentElement.parentElement.firstElementChild.innerText;
        let isDelete = confirm(`Estas seguro de eliminar el id ${id}?`)

        if(isDelete){
            try {
                const response = await fetch(`/products/${id}`, {
                    method: 'DELETE',
                    headers: {},
                })

                if(!response.ok){
                    const p = document.getElementById('producto-id');
                    p.innerText = `Ocurrio un error al eliminar el producto`;
                }
                location.reload();

            } catch (error) {
                console.log(error);
            }
        }
    }
})
async function removeFromCart(cid, pid){
    let isDelete = confirm(`Estas seguro de eliminar el producto con id: ${id} del carrito?`)
    if(isDelete){
        try {
            const response = await fetch(`/carts/${cid}/products/${pid}`, {
                method: 'DELETE',
                headers: {},
            })

            if(!response.ok){
                const p = document.getElementById('producto-id');
                p.innerText = `Ocurrio un error al eliminar el producto`;
            }
            location.reload();

        } catch (error) {
            console.log(error);
        }
    }
}
function limpiarHtml(){
    tbody.innerHTML = ``;
}
socket.on('messages', function(data) { 
  console.log(data);
  renderMensagge(data);
});

function renderMensagge(prodsAgregados) { 
    let fecha = new Date();
    let ahora = fecha.toLocaleString();
    let html = prodsAgregados.map(function(elem, index){ 
      return(`<div>
            <strong>${elem.author}</strong> <span>${ahora}</span>: 
            <em>${elem.text}</em> </div>`) 
    }).join(" "); 
    document.getElementById('messages').innerHTML = html; 
}

function addMessage() { 
    let mensaje = { 
      author: document.getElementById('username').value, 
      text: document.getElementById('texto').value
    }; 
    socket.emit('new-message', mensaje); 

    document.getElementById('texto').value = ''
    document.getElementById('texto').focus()

    return false;
}