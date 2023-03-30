import { Server } from 'socket.io';
import {instanciaProduct, instanceMessage} from '../dao/clases.js';

export default async function configureSocket(httpServer){
    const io = new Server(httpServer)
    io.on('connection', async (socket) =>{
        const productos = await instanciaProduct.getAll(); 
        socket.emit('products', productos);
        console.log(`socket conectado `);
        socket.on('message', async data=>{
            await instanceMessage.save(data);
            const allMessage = await instanceMessage.getAll();
            const messages = [];
            const message = allMessage.map(e=>{
                messages.push(e._doc);
            })
            io.emit('messageLogs', messages)
        })
        socket.on('new_user', async data=>{
            socket.emit('messageLogs', await instanceMessage.getAll());
            socket.broadcast.emit('user', data);
        })
        
    })

}