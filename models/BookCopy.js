const {model,Schema} = require('mongoose')

const BookCopySchema = new Schema({
  CopyId: String,
  IssueDate: {type: Date, default: null},
  ReturnDate:  {type: Date, default: null},
  Availability:{
      type: String,
      enum: ['loaned','available','reserved','mia'],
      default: 'available'
  }
})

module.exports = model('BookCopy',BookCopySchema,'BookCopies')