require('dotenv').config()
const nodemailer = require('nodemailer')
const promisify = require('promisify')
const crypto = require('crypto')

const mailer = async(body) =>{

    let transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "385adffa91fdce",
          pass: "333881cebc8b08"
        }
      });




      let mailInfo = {
        from: process.env.SENDER, // sender address
        to: body.to, // list of receivers
        subject: body.subject, // Subject line
        text: body.text, // plain text body
        html: `<p>${body.text}</p>` // html body
      }
   return await transporter.sendMail(mailInfo)
      
}

module.exports = mailer;