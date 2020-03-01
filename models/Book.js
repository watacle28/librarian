const {Schema,model} = require('mongoose')

const BookSchema = new Schema({
    name: String,
    genres: [String],
    author: String,
    coverImg: String,
    number0fPages: Number,
    isAvailable: {type: Boolean, default: true},
    owner: {type: Schema.Types.ObjectId,
            ref: 'User'},
    reviews:[{type: Schema.Types.ObjectId,ref: 'Review'}]
},{timestamps: true})

module.exports = model('Book',BookSchema)