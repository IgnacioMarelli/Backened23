import express from 'express';
import mongoose from 'mongoose';
import config from '../data.js';
import cookieParser from 'cookie-parser';
const app = express();
import fileDirName from './utils/fileDirName.js';
const { __dirname } = fileDirName(import.meta);
import { routerChat } from './Routes/routerChat.js';
import { routerCart } from './Routes/routerCart.js';
import { routerUser } from './Routes/routerUser.js';
import { router } from './Routes/routerProds.js'
import configureHandlebars from './hb/hbs.middleware.js';
import configureSocket from './Server/configure-socket.js';
import passport from 'passport';
import { configPassport } from './config/passport.config.js';
const {PORT, MONGO_URL, DAO} = config;
if(DAO==='MONGO'){
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});}
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser(config.cookie_secret));
app.use(express.static(__dirname+'/public'));
app.set('views', __dirname+'/views');
app.use('/api/products', router, express.static(__dirname+'/public'));
app.use('/api/carts', routerCart, express.static(__dirname+'/public'));
app.use('/api/session', routerUser, express.static(__dirname+'/public'));
app.use('/api/chat', routerChat);

app.use((error, res)=>{
    console.error({error});
    res.status(500).json({error});
})


app.use(passport.initialize());

configPassport()
configureHandlebars(app)
process.argv[2]='MONGO';
const httpServer = app.listen(PORT, ()=>console.log(`Servidor escuchando en el puerto ${PORT }`));
configureSocket(httpServer);
