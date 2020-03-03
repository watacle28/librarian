module.exports.validateRegister = ({name,email,password,confirmPassword})=>{
    const errors = {}
    const isemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if(name.trim() == ''){
        errors.name = 'field can not be empty'
       // throw new Error({errors})
    }

    if(email.trim() ==''){
        errors.email = 'please provide an email'
        // throw new Error({errors})
    }else if(!email.match(isemail)){
        errors.email = 'email address is not valid'
    }
    if(password == ''){
      errors.password = 'please enter password'
    //   throw new Error({errors})
    }
    if(password != confirmPassword){
        errors.confirmPassword = 'passwords do not match'
        // throw new Error({errors})
    }
    return {
        errors,
        isValid : Object.keys(errors) < 1
    }
}

module.exports.validateLogin = ({email,password})=>{
    const errors = {}
    if(email == ''){
        errors.email = 'please provide your email address'
    }
    if(password == ''){
        errors.password = 'password required to continue'
    }
    return {
        errors,
        isValid: Object.keys(errors) < 1
    }
}