const {Router} = require('express')
const router = Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
       res.status(400).json({errors})
       return;
    }
    
//check if email is in use
    const emailExists = await User.findOne({email})
 
   if(emailExists) {
      
       errors.email = 'email is taken'
       res.status(400).json({errors})
       return;
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
        res.status(400).json({errors})
        return;
    }
    //check email 
    const user = await User.findOne({email})
    if(!user){
        errors.email = 'email not linked to any account'
        res.status(400).json({errors})
        return;
    }
    //validate password
    const valid = await bcrypt.compare(password,user.password)

    if(!valid){
        errors.password = 'passwword entered is wrong'
        res.status(401).json({errors})
        return;
    }

   //create token

   const token = jwt.sign({userId: user._id, role: user.role},process.env.JWTSecret)

   res.status(200).json({user,token})
})


module.exports = router;