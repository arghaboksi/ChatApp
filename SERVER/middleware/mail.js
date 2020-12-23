const nodemailer = require('nodemailer');

let nodemail = (token,mail) => {
    // let data = jwt.verify(token,'forgot')

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "put some mail id",
            pass: process.env.PASSWORD
        }
    });

    let mailOptions = {
        from: 'put some mail id',
        to: mail,
        subject: 'password change', 
        text: token.url
    };

    transporter.sendMail(mailOptions,(err,data)=>{
        if(err)
            console.log("error occurs");
        else
            console.log("mail sent");
    })
}
module.exports={nodemail}