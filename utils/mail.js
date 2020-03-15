const nodemailer = require('nodemailer')
const crypto = require('crypto')

const sendmail = async() =>{
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass // generated ethereal password
        }
      });

      let mailInfo = {
        from: 'watatest@gmail.com', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Password Reset", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>" // html body
      }

     let response =  await transporter.sendMail(mailInfo)
}

module.exports = sendmail;