const express = require('express');
const app = express();
const {router} = require('./Routes/router');
const {routerCart} = require('./Routes/cartRoute');
app.use(express.urlencoded({extended:true}));

app.use('/products', router);
app.use('/carts', routerCart);


const PORT = 8080;
app.listen(PORT, ()=>console.log(`Servidor escuchando en el puerto ${PORT}`))