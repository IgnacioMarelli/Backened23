import express from 'express';
const app = express();
import fileDirName from './utils/fileDirName.js';
const { __dirname } = fileDirName(import.meta);
import { router, routerCart, routerSocket } from './Routes/views.router.js'
import handlebars from 'express-handlebars';
import configureSocket from './Server/configure-socket.js';
app.use(express.urlencoded({extended:true}));
app.use('/products', router);
app.use('/carts', routerCart);
app.use('/realTimeProducts', routerSocket);
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));

const PORT = 8080;
const httpServer = app.listen(PORT, ()=>console.log(`Servidor escuchando en el puerto ${PORT}`));
configureSocket(httpServer);