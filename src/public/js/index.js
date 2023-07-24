const socket = io();
const form = document.getElementById('crud-form');
const query = new URLSearchParams(window.location.search);

async function buy(cid){
    try{
        const response = await api.post(`/api/carts/${cid}/purchase`);
        if (response.ok) {
            Swal.fire({
                title: 'Compra confirmada',
                text: 'En segundos le llegará un mail con el ticket de compra',
                icon: 'succes'
            });
            setTimeout(function() {
                location.href = 'https://backened23-production.up.railway.app/api/products';
            }, 3000);
        }else{
            if(response.status===500){
                Swal.fire({
                    title: 'Error al comprar',
                    text: 'Es probable que no haya suficiente stock, elimine el producto y vuelva a elegir por favor',
                    icon: 'error'
                  });   
            }else{
                throw new Error
            }
            
        }
    }catch(error){
        Swal.fire({
            title: 'Error',
            text: 'Hubo un error en la solicitud',
            icon: 'error'
          });   
    }
}

async function addProd(id) {
    const cid=undefined;
    let quantity=1
    try{
        await api.put(`/api/carts/${cid}/products/${id}`, {
            quantity,
            })
        
        Swal.fire({
            title: 'Agregado al carrito',
            text: 'Libro Agregado',
            icon: 'succes'
        });
        setTimeout(function() {
            location.href = 'https://backened23-production.up.railway.app/api/products';
        }, 1500);
    }catch(e){
        let message = error.statusText || 'Ocurrio un error';
        const p = document.getElementById('producto-id');
        p.insertAdjacentHTML("afterend", `<p><b>Error: ${message} intenta mas tarde</b></p>`);
    }
};

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
document.addEventListener('submit', async e => {
    if (e.target === form) {
      e.preventDefault();
  
      if (!e.target.id.value) {
        try {
          const formData = new FormData(e.target);
  
          const response = await api.postProd('/api/products', formData);
            if (!response.ok) {
            if (response.status===403) {
                Swal.fire({
                    title: 'Error',
                    text: 'Usted no se encuentra autorizado por su rol para subir productos',
                    icon: 'error'
                    }); 
            }else{
                throw new Error('Error en la solicitud');
            }
            } else {
            Swal.fire({
                title: 'Producto subido',
                text: 'Se ha agregado el producto correspondietne',
                icon: 'success'
                }); 
            }
        } catch (error) {
            Swal.fire({
                title: 'Error en la solicitud',
                text: 'Ocurrió un error. Intentelo nuevamente mas tarde',
                icon: 'error'
              }); 
        }
      }
    }
  }); 
  
  
  
  

document.addEventListener('click', async e =>{
    if(e.target.matches('.delete')){
        const id = e.target.parentElement.parentElement.firstElementChild.innerText;
        let isDelete = confirm(`Estas seguro de eliminar el id ${id}?`)

        if(isDelete){
            try {
                const response = await fetch(`/api/products/${id}`, {
                    method: 'DELETE',
                    headers: {},
                })
                if(response.status===403){
                    Swal.fire({
                        title: 'Error',
                        text: 'No esta autorizado para eliminar productos',
                        icon: 'error'
                      });
                }
                if(!response.ok){
                    const p = document.getElementById('producto-id');
                    p.innerText = `Ocurrio un error al eliminar el producto`;
                }else{
                    location.reload();
                }
            
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Se produjo un error en la solicitud.',
                    icon: 'error'
                  });
            }
        }
    }
})
async function removeFromCart(cid, pid) {
    try {
      const result = await Swal.fire({
        title: 'Estás seguro?',
        text: `Estas seguro de eliminar el producto con id: ${pid} del carrito?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar'
      });
  
      if (result.isConfirmed) {
        const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
          method: 'DELETE',
          headers: {},
        });
  
        if (!response.ok) {
            throw new Error
        } else {
          location.reload();
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Se produjo un error en la solicitud.',
        icon: 'error'
      });
    }
  }
  

function limpiarHtml(){
    tbody.innerHTML = ``;
}
socket.on('messages', function(data) { 
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

socket.on('usuario', data =>{
    Swal.fire({
        text:`Se conecto ${data}`,
        toast:true,
        position:"top-right"
    })
})
