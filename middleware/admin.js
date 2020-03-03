  
const checkIfAdmin = (req,res,next)=>{
    console.log(req.user.role)
    next()
}

module.exports = checkIfAdmin;