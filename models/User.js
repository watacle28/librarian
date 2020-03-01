const {Schema,model} = require('mongoose')

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['Member','Librarian','Partner'],
        default: 'Member'
    },
    booksOwned: [{type: Schema.Types.ObjectId,ref: 'Book'}],
    borrowed: [{type: Schema.Types.ObjectId, ref: 'Book'}],
    owing: {type: Number, default: 0}

},{timestamps: true})

module.exports = model('User',UserSchema)

