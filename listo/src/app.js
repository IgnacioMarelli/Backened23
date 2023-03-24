import express from 'express';
const app = express();
import { router } from './Routes/views.router.js'
import mongoose from 'mongoose';
app.use(express.urlencoded({extended:true}));
app.use('/products', router);
app.use((error, req, res, next)=>{
    console.error({error});
    res.status(500).json({error});
})


const PORT = 8080;
app.listen(PORT, ()=>console.log(`Servidor escuchando en el puerto ${PORT}`));

