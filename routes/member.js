require('dotenv').config()
const {Router} = require('express')
const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`)
const router = Router();

const BookCopy = require('../models/BookCopy')
const Book = require('../models/Book')
const Fine = require('../models/Fine')
const Reservation = require('../models/Reservation')
const {MAX_RESERVATIONS} = require('../utils/constants')

async function getFines(member){
   return await Fine.find({member})
}


/*
3. edit own profile
4. add a review
*/
// add a review

router.post('/review/:bookId',async(req,res)=>{
  const {body} = req.body
  const {useId} = req.user
   
  const book = await Book.findById({_id: req.params.bookId})
  book.reviews.push({
    postedBy: useId,
    body
  })
 await book.save()

 res.json({msg: 'new review added ',book})

})

  
// view all books
router.get('/', async(req,res)=>{
    const books = await Book.find();
    res.json({books})
})
 
//reserve a book
  router.post('/reserve',async(req,res)=>{
      //check if any copies of book are available
      const {_id} = req.body
      const book = await Book.findById({_id});
      if(book.availableCopies < 1){
        return res.json({error: 'no copies available  , please try again some time'})
      }

      //check for any fines
    const fines = await getFines(req.user.userId)
      if(fines && fines.length > 1){
        res.redirect(200,'payFine')
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

//pay fines
  router.post('/payFine',async(req,res)=>{
    //calculate total payable fine
    const fines = await getFines(req.user.userId)

   try {

    const totalfines = fines.reduce((acc, fine)=> acc + fine)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalfines ,
      currency: 'zar',
      
    });
      res.json({clientSecret: paymentIntent.client_secret})

   } catch (error) {
     res.json({error})
   }
   
    
  })

  
module.exports = router;






































module.exports = router;