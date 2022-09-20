const mongoose= require('mongoose')
const dotenv=require('dotenv')
dotenv.config()
mongoose.connect(process.env.DB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true,
    useFindAndModify:false
})







// const problemSolving=new tasks({
//     description:'finish node course',
//     completed:false
// })


// problemSolving.save().then(()=>{
// console.log(problemSolving)
// }).catch((error)=>{
// console.log('Error!!',error)
// })





// const andrew= new User({
//     name:'aiven',
//     email:'andrew.aisr@gmail.com',
//     age:20,
//     password:'222222'
// })

// andrew.save().then(()=>{
//     console.log(andrew)
// }).catch((error)=>{
//     console.log('Error!',error)
// })



// const me= new User({
//     name:'aisr',
//     email:'mike.dsds@gmail.com',
//     age:20,
//     password:'123456'
// })
// me.save().then(()=>{
// console.log(me)
// }).catch((error)=>{
// console.log('Error!',error)
// })