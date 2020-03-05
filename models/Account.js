const {Schema,model} = require('mongoose')
const AccountSchema = new Schema({
    cashBox: Number,
    finesDue: [{type: Schema.Types.ObjectId, ref: 'Fine'}],
    expenses: Number
},{timestamps: true})

module.exports = model('Account',AccountSchema)
