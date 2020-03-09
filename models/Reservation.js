const{Schema,model} = require('mongoose')

const ReservationSchema = new Schema({
    book: {type: Schema.Types.ObjectId, ref: 'Book'},
    member: {type: Schema.Types.ObjectId, ref: 'User'},
    isActive: {type: Boolean, default: true}

},{timestamps: true})

module.exports = model('Reservation',ReservationSchema);