const {model,Schema} = require('mongoose');

const RequestSchema = new Schema({
    book: {type: Schema.Types.ObjectId, ref: 'Book'  },
    member: {type: Schema.Types.ObjectId, ref: 'User'}
},{timestamps: true})

module.exports = model('Request', RequestSchema)