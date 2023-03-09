import { Server } from 'socket.io'
import ProductManage from '../../clases.js';
const instance = new ProductManage('../products.json');

export default function configureSocket(httpServer){
    const socketServer = new Server(httpServer)
    socketServer.on('connection', (socket) =>{
        socket.emit('products', instance.getProducts());
        console.log('socket conectado');

    })

}