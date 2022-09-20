const sgMail= require('@sendgrid/mail')
const dotenv=require('dotenv')

dotenv.config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email,name)=>{
sgMail.send({
    to:email,
    from:'andrawesaisr@gmail.com',
    subject:'Thanks for joining us!!',
    text:`Welcome to use this app,${name} let me know how you get along with the app.`
})
}
const sendByeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'andrawesaisr@gmail.com',
        subject:'bye!!',
        text:'we hope you enjoyed your time on the application'
    })
}

module.exports={
sendWelcomeEmail,
sendByeEmail
}