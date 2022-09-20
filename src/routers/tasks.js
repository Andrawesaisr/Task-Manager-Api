const express = require('express')
const Task=require('../models/task')
const Auth=require('../middleware/auth')

const router=new express.Router()   

router.post('/tasks',Auth,async(req,res)=>{
    const task= new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

// /tasks?completed= false or true
// /tasks?limit= 1 or 2 or 3&skip=1 or 2 or 3 or 4
router.get('/tasks',Auth,async(req,res)=>{
    const match={}
    if(req.query.completed){
        match.completed= req.query.completed==='false'?false:true
    }  
const sort={}
    if(req.query.sortedBy){
        const part=req.query.sortedBy.split(':')
        sort[part[0]]= part[1]==="desc"?-1:1
    }
    try{
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
                 
            }
        }).execPopulate()
        res.send(req.user.tasks)    
    }catch(e){
        res.status(500).send(e)
    }
   
})   



router.get('/tasks/:id',Auth,async (req,res)=>{
    const _id=req.params.id
    try{
        const task=await Task.findOne({_id,owner:req.user._id})
        if(!task){
           return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()  
    }
    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send()
    //     }

    //     res.send(task)
    // }).catch(()=>{
    //     res.status(500).send()
    // })
})
 
router.patch('/tasks/:id',Auth,async(req,res)=>{
     
    const updates=Object.keys(req.body)
    const allawed=['description','completed']
    const result=updates.every((update)=>allawed.includes(update))
    if(!result){
        return res.status(404).send({'error':'Invalid Updates!'})
    }

    try{
        const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
    
        if(!task){
            return res.status(404).send()
        }
    
        updates.forEach((update)=>task[update]=req.body[update])
        await task.save()

        res.status(200).send(task)
    }catch(e){  
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id',Auth,async(req,res)=>{
    const _id=req.params.id
    try{
        const task=await Task.findByIdAndDelete({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})
 

module.exports=router 