const {model,Schema} = require('mongoose')

const BookCopySchema = new Schema({
  Book: {type: Schema.Types.ObjectId, ref: 'Book'},  
  copyId: String,
  IssueDate: {type: Date, default: null},
  ReturnDate:  {type: Date, default: null},
  Availability:{
      type: Boolean,
    
      default: true
  }
})

module.exports = model('BookCopy',BookCopySchema,'bookCopies')