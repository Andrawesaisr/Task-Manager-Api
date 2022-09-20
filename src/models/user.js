const mongoose= require('mongoose')
const validator = require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('./task')
const dotenv=require('dotenv')  
dotenv.config()

const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },email:{
        type:String,
        unique:true,
        require:true,
        trim:true,
        lowercase:true,
        validate(value){
             if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
             }
        }

    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age must be posive number')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:6,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Not allowed to enter password!!')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id' ,
    foreignField:'owner'
})

userSchema.methods.toJSON= function(){
    const user=this
    const ObjectUser=user.toObject()
    delete ObjectUser.password
    delete ObjectUser.tokens
    delete ObjectUser.avatar

    return ObjectUser
}



userSchema.statics.findByCredentials =async (email,password)=>{
    const user=await User.findOne({email})
    if(!user){
        throw new Error('Unable to login')  
    }
    const match =await bcrypt.compare(password,user.password)
    if(!match){
        throw new Error('Unable to login')
    }
    
    return user
}

userSchema.methods.generateAuthToken=async function() {
    const user =this
    const token= jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token})
   
    await user.save()
    return token
}

// hashing the password
userSchema.pre('save',async function (next) {
    const user= this
   if(user.isModified('password')){
    user.password=await bcrypt.hash(user.password,8)
   }

    next()
})

userSchema.pre('remove',async function(next){
    const user =this
    await Task.deleteMany({owner:user._id})
  
    next()
})

const User=mongoose.model('User',userSchema)

module.exports=User