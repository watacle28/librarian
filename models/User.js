const {Schema,model} = require('mongoose')

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    profilePic: String,
    role: {
        type: String,
        enum: ['Member','Admin'],
        default: 'Member'
    },
    isBlocked: {type: Boolean, default: false},
    borrowed: [{type: Schema.Types.ObjectId, ref: 'BookCopy'}],



},{timestamps: true})

module.exports = model('User',UserSchema)

