  
const checkIfPartner = (req,res,next)=>{
    (req.user.role)
    next()
}

module.exports = checkIfPartner;