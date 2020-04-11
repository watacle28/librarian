const {Router} = require('express')
const router = Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const sendmail = require('../utils/mailer')

require('dotenv').config();
const User = require('../models/User');
const {validateLogin,validateRegister} = require('../validation')


//sign up user
// route /register 
// puplic

router.post('/register', async(req,res)=>{
     const {email,password,confirmPassword,name} = req.body
     const{isValid,errors} = validateRegister(req.body)
     
    
//validate user input
    if(!isValid){
        (errors);
       return res.status(400).json({errors})
       
    }
    
//check if email is in use
    const emailExists = await User.findOne({email})
 
   if(emailExists) {
      
       errors.email = 'email is taken'
      return res.status(400).json({errors})
      
   }
    //hash password
    const hashedPassword =  await bcrypt.hash(password,12);
    
    //create new user
    const newUser = new User({
        email,
        name,
        password: hashedPassword,
        confirmPassword
    })
    await newUser.save();

    //create token

    const token = jwt.sign({userId: newUser._id, role: newUser.role}, process.env.JWTSecret)
   res.status(200).json({
       user: newUser,
       token
   })

    
})


router.post('/login',async(req,res)=>{
    const {isValid,errors} = validateLogin(req.body)
    const{email,password} = req.body;
    //validate input
    if(!isValid){
    
     return res.status(400).json({status: 400,errors})
       
    }
    //check email 
    const user = await User.findOne({email})
    if(!user){
        errors.email = 'email not linked to any account'
       return res.status(400).json({errors})
         
        
    }
    //validate password
    const valid = await bcrypt.compare(password,user.password)

    if(!valid){
        errors.password = 'passwword entered is wrong'
       return res.status(401).json({errors})
    }

   //create token

   const token = jwt.sign({userId: user._id, role: user.role},process.env.JWTSecret)

   res.status(200).json({token})
})

//forgot password
router.post('/forgot',async(req,res)=>{
    //check if user exists
    const {email} = req.body
    const user = await User.findOne({email})
    if (!user){
        return res.json({error:`user with ${email} not found`}) 
    }

    //create a token , expiration date
    const resetToken = crypto.randomBytes(20).toString('hex')
    const tokenExpiration = Date.now() + 360000 //expires in an hour

    //update user
    user.resetToken = resetToken;
    user.tokenExpiration = tokenExpiration;
    await user.save();
    
    //send email with token
    try {
        const to = user.email
        const subject = 'Reset Password'
        const link = `http://${req.headers.host}/api/auth/reset/${user.resetToken}`
        const text = `Hello , please follow ${link} to reset your password, link is valid for an hour`
        const html = `<p>${text}</p>`

        await sendmail({to,subject,text,html})
        res.redirect('reset')
        
    } catch (error) {
        res.json({errro: error.message})
    }


})

router.post('/reset:token',async(req,res)=>{
  const resetToken = req.params.token
 //check if token is valid
 const user = await User.findOne({resetToken,tokenExpiration:{$gt: Date.now()}})
 if(!user){
     return res.status(401).json({error: 'token is not valid/expired'})
 }

 //check if passwords are the same
 if (req.body.password === '') {
     return res.json({error: 'password is required'})
 }
 if(req.body.password !== req.body.confirmPassword){
     return res.json({error: 'passwords do not match'})
 }
 //hash password with bcrypt
 const hashed = await bcrypt.hash(req.body.password, 10)
  
 //update user details
 try {
    user.resetToken = null;
    user.tokenExpiration = null;
    user.password = hashed;
    const updatedUser = await user.save()
   
    res.json({updatedUser})

 } catch (error) {
     res.json({error: error.message})
 }
})



module.exports = router;