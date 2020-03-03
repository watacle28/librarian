  
const checkIfPartner = (req,res,next)=>{
    console.log(req.user.role)
    next()
}

module.exports = checkIfPartner;