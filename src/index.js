const express =require('express')
require('./db/mongoose')
const usersRouter=require('./routers/users')
const tasksRouter=require('./routers/tasks')

const app=express()
const port=process.env.PORT

 


app.use(express.json())
// user router-----------------------------------------------------
app.use(usersRouter)
// task router----------------------------------------------------
app.use(tasksRouter)

 



app.listen(port,()=>{
    console.log('Server is up on port ',port)
})

