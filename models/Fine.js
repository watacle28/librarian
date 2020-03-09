const {model,Schema} = require('mongoose');

const FineSchema =new Schema({
    member: {type: Schema.Types.ObjectId, ref: 'User'},
    amount: {type: Number, default: 0},
    copy: {type: Schema.Types.ObjectId, ref: "BookCopy"}
})


module.exports = model('Fine',FineSchema);