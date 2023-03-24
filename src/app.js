import express from 'express';
import mongoose from 'mongoose';
import config from './data.js';
const app = express();
import fileDirName from './utils/fileDirName.js';
const { __dirname } = fileDirName(import.meta);
import { router, routerCart, routerSocket, routerHome } from './Routes/views.router.js'
import configureHandlebars from './hb/hbs.middleware.js';
import configureSocket from './Server/configure-socket.js';
app.use(express.urlencoded({extended:true}));
app.use('/products', router);
app.use('/carts', routerCart);
app.use('/realTimeProducts', routerSocket);
app.use('/chat', routerHome);
app.set('views', __dirname+'/views');
app.use(express.static(__dirname+'/public'));
app.use((error, req, res, next)=>{
    console.error({error});
    res.status(500).json({error});
})
const {PORT, MONGO_URL} = config;
configureHandlebars(app)
const httpServer = app.listen(PORT, ()=>console.log(`Servidor escuchando en el puerto ${PORT}`));
//configureSocket(httpServer);
const connection = mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });