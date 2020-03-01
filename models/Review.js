const {Schema,model} = require('mongoose')
 const ReviewSchema = new Schema({
     postedBy: {type: Schema.Types.ObjectId,ref: 'User'},
     body: String
 },{timestamps: true})

 module.exports = model('Review',ReviewSchema)