import express from 'express';
import mongoose from 'mongoose';
import config from '../data.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
const app = express();
import fileDirName from './utils/fileDirName.js';
const { __dirname } = fileDirName(import.meta);
import { routerChat } from './Routes/routerChat.js';
import { routerCart } from './Routes/routerCart.js';
import { routerUser } from './Routes/routerUser.js';
import { router } from './Routes/views.router.js'
import configureHandlebars from './hb/hbs.middleware.js';
import configureSocket from './Server/configure-socket.js';
import passport from 'passport';
import { configPassport } from './config/passport.config.js';
const {PORT, MONGO_URL} = config;

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser(config.cookie_secret));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 15,
    }),
    secret: config.cookie_secret,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.static(__dirname+'/public'));
app.use('/api/css', express.static(__dirname + '/public/css'));
app.use('/api/js', express.static(__dirname + '/public/js'));
app.set('views', __dirname+'/views');
app.use('/api/products', router, );
app.use('/api/carts', routerCart,express.static(__dirname+'/public'));
app.use('/api/users', routerUser,express.static(__dirname+'/public'));
app.use('/api/chat', routerChat,express.static(__dirname+'/public'));
app.use(passport.initialize());
app.use(passport.session());
app.use((error, req, res, next)=>{
    console.error({error});
    res.status(500).json({error});
})



configPassport()
configureHandlebars(app)

const httpServer = app.listen(PORT, ()=>console.log(`Servidor escuchando en el puerto ${PORT}`));
configureSocket(httpServer);
