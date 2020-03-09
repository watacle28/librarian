const {Schema,model} = require('mongoose')
const FinanceSchema = new Schema({
    cashBox: Number,
    finesDue: [{type: Schema.Types.ObjectId, ref: 'Fine'}],
    expenses: Number
},{timestamps: true})

module.exports = model('Finance',FinanceSchema)
