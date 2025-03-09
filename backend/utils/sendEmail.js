import nodemailer from "nodemailer"

import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
    service:"gmail",
    host:process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    secure:false,
    auth:{
        user:process.env.GMAIL_USER,
        pass:process.env.GMAIL_PASS,
    },
})

// console.log(process.env.GMAIL_USER)
// console.log(process.env.GMAIL_PASS) 
// console.log(process.env.SMTP_HOST)
// console.log(process.env.SMTP_PORT) 




const sendEmail = async({to,subject,text,html})=>{
    try {

        const mailOptions = {
            from:process.env.GMAIL_USER,
            to,
            subject,
            text,
            html,
        };

        await transporter.sendMail(mailOptions)
        console.log("Email sent successfully!");
        
        
    } catch (error) {
        console.error("Error sending email:", error);
    }
}


export default sendEmail;