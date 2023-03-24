import { Server } from 'socket.io'
import ProductManage from '../dao/fileSistem.js';
const messages = [];
const instance = new ProductManage('../products.json');
export default async function configureSocket(httpServer){
    const io = new Server(httpServer)
    io.on('connection', (socket) =>{
        socket.emit('products', instance.readFile());
        console.log(`socket conectado `);
        socket.on('message', data=>{
            messages.push(data);
            io.emit('messageLogs', messages)
        })
        socket.on('new_user', data=>{
            socket.emit('messageLogs', messages);
            socket.broadcast.emit('user', data);
        })
        
    })

}