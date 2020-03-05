const {Schema,model} = require('mongoose')

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    profilePic: String,
    role: {
        type: String,
        enum: ['Member','Librarian','Partner'],
        default: 'Member'
    },
    booksOwned: [{type: Schema.Types.ObjectId,ref: 'Book'}],
    borrowed: [{type: Schema.Types.ObjectId, ref: 'Book'}],


},{timestamps: true})

module.exports = model('User',UserSchema)

