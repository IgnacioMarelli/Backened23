import { Server } from 'socket.io';
import {instanceMessage, instanceUser} from '../dao/mongo.manager.js';

export default async function configureSocket(httpServer){
    const io = new Server(httpServer)
    io.on('connection', async (socket) =>{
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
        socket.on('registrado', async (data)=>{
            socket.emit('usuario', data);
        })
    })

}