const {Schema,model} = require('mongoose')

const reviewSchema = new Schema({
    postedBy: {type: Schema.Types.ObjectId,ref: 'User'},
    body: String
},{timestamps: true}
)

const BookSchema = new Schema({
    name: String,
    genres: [String],
    author: String,
    coverImg: String,
    number0fPages: Number,
    isAvailable: {type: Boolean, default: true},
    owner: {type: Schema.Types.ObjectId,
            ref: 'User'},
    reviews:[reviewSchema]
},{timestamps: true})

module.exports = model('Book',BookSchema)