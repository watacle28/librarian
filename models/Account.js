const {Schema,model} = require('mongoose')
const AccountSchema = new Schema({
    cashBox: Number,
    debtors: Number
},{timestamps: true})

module.exports = model('Account',AccountSchema)
