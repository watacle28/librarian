const {Schema,model} = require('mongoose')

const CopyIssueSchema = new Schema({
    copy: {type: Schema.Types.ObjectId, ref: 'BookCopy'},
    member: {type: Schema.Types.ObjectId, ref: 'User'},
    dateIssued: Date,
    returnDate: Date
})

module.exports = model('IssueCopy', CopyIssueSchema,'issued_copies')