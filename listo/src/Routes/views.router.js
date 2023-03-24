import express from 'express';
import { Router } from 'express';
import { userModel } from '../models/user.model.js';
const router = Router();



router.get('/', async (req, res,next)=>{
    try{
        const usuarios = await userModel.find();
        res.send({usuarios});
   } catch(error){
    next(error);
   }
    
 })
router.get('/:pid',  async (req, res)=>{  
    const params = req.params.pid;
    const usuario = await userModel.findOne({_id:params});
    res.send(usuario); 
})
router.post('/', async(req, res, next)=>{
    const usuarios=req.body;
    try{
    const u = await userModel.create(usuarios);
    res.status(201).send({u});
    }catch(error){
        next(error)
    }
})


router.put('/:pid', async(req, res)=>{
    try{
        
    }catch(error){
        next(error)
    }
    const params = req.params.pid;
    const nuevosDatos = req.body;
    const usuario = await userModel.find({_id:params});
    await userModel.updateOne({_id})
    if(usuario == error){
        res.status(400).render(usuario);
        return
    }
    res.status(200).render(usuario);

})

router.delete('/:pid', async (req, res)=>{
    const params = req.params;
    const pid = Number(params.pid);
    const eliminado = await instanceProd.deleteById(pid);
    res.status(200).send(eliminado);
})



export  { router };