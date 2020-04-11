const {Schema,model} = require('mongoose')

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    profilePic: String,
    resetToken: String,
    tokenExpiration: Date,
    role: {
        type: String,
        enum: ['Member','Admin'],
        default: 'Member'
    },
    isBlocked: {type: Boolean, default: false},
    borrowed: [{type: Schema.Types.ObjectId, ref: 'BookCopy'}],
    reservations: {type:Number, default:0},
    fines: [{type: Schema.Types.ObjectId, ref: 'Fine'}]



},{timestamps: true})

module.exports = model('User',UserSchema)

