const {Router} = require('express')
const router = Router();

const BookCopy = require('../models/BookCopy')
const Book = require('../models/Book')
const Fine = require('../models/Fine')
const Reservation = require('../models/Reservation')
const {MAX_RESERVATIONS} = require('../utils/constants')
  //test 
  /*
member routes
1. borrow books
2. view all books
3. edit own profile
4. add a review
5. pay up credits
6. pay membership fees
7.view own acc...books borrowed, arrears, due dates
8.reserve a book

*/

  router.get('/reserve',async(req,res)=>{
      //check if any copies of book are available
      const {_id} = req.body
      const book = await Book.findById({_id});
      if(book.availableCopies < 1){
        return res.json({error: 'no copies available  , please try again some time'})
      }

      //check for any fines
      const fines = await Fine.find({member: req.user.userId})
      if(fines && fines.length > 1){
        res.redirect('/payFine')
      }

     
         const userReserves = await Reservation.find({member: req.user.userId})
         if(userReserves > 1)  {
             //check if reserved book already
             const reserved_book_already = userReserves.filter(item =>JSON.stringify(item.book) === JSON.stringify(book._id) )
                if(reserved_book_already){
                  return res.json({error: 'you have the book already in your cart'})
                }
            //check if max reserves is reached
                if(userReserves == MAX_RESERVATIONS){
                  return res.json({error: 'reserved enough books'})}
           
        }
        
      //create a reservation valid for a day
      const new_reservation = await new Reservation({
              book : book._id,
              member: req.user.userId
      })
      .save()
      //update copies of book reserved on db
      book.availableCopies --;
      book.reservations += 1;
       await book.save();
                                     

    return res.json({success: true, new_reservation})










  })

module.exports = router;






































module.exports = router;