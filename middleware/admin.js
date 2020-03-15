  
const checkIfAdmin = (req,res,next)=>{
 if(req.user.role !==  'Admin')
  {
     return res.status(401).json({error: 'not an admin, oopsy'})
  }
  next()
}

module.exports = checkIfAdmin;