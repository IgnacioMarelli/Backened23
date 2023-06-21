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
import errorMiddleware from './utils/middlewares/error.middleware.js';
import { addLogger } from './utils/winston.customlevels.js';
const {PORT, MONGO_URL, DAO} = config;
if(DAO==='MONGO'){
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});}
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser(config.SECRET));
app.use(express.static(__dirname+'/public'));
app.use(addLogger)
app.set('views', __dirname+'/views');
app.use('/products', router);
app.use('/carts', routerCart);
app.use('/session', routerUser);
app.use('/chat', routerChat);
app.get('/loggerTest', (req, res) => {
  const logger = req.logger;

  logger.debug('Mensaje de debug');
  logger.http('Mensaje HTTP');
  logger.info('Mensaje de información');
  logger.warning('Mensaje de advertencia');
  logger.error('Mensaje de error');
  logger.fatal('Mensaje de error fatal');

  res.send('Logs generados');
});
app.use(passport.initialize());
app.use(errorMiddleware)

configPassport()
configureHandlebars(app)

const httpServer = app.listen(PORT, ()=>console.log(`Servidor escuchando en el puerto ${PORT }`));
configureSocket(httpServer);
