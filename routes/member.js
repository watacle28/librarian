require('dotenv').config()
const {Router} = require('express')
const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`)
const router = Router();

const BookCopy = require('../models/BookCopy')
const Book = require('../models/Book')
const User = require('../models/User')
const Fine = require('../models/Fine')
const Reservation = require('../models/Reservation')
const {MAX_RESERVATIONS} = require('../utils/constants')

async function getFines(member){
   return await Fine.find({member})
}
router.get('/user',async(req,res)=>{
  const _id = req.user.userId;
  try {
    const user = await User.findById(_id).select('-password');
  
    return res.json({user})
  } catch (error) {
   return res.json({error: error.message})
  }


})


// edit own profile
router.put('/profile',async(req,res)=>{
  const {email,name} = req.body
 try {
  const profile = await User.findByIdAndUpdate({_id:req.user.useId},{email,name},{new: true})
  return res.json({msg:'successfuly edited profile',profile})
 } catch (error) {
   return res.json({error})
 }
})

// add a review

router.post('/review/:bookId',async(req,res)=>{
  const {body} = req.body
  const {useId} = req.user
   
  const book = await Book.findById({_id: req.params.bookId})
  //check if no review added already
  const has_reviewed = book.reviews.filter(review => JSON.stringify(review.postedBy) === JSON.stringify(useId))
  if(has_reviewed.length >= 1){
   return res.json({error: 'has reviewed'})
   
  }

  book.reviews.push({
    postedBy: useId,
    body
  })
 await book.save()

 res.json({msg: 'new review added ',book})

})

  //get all user reservations
  router.get('/reserves',async(req,res)=>{
    try {
      const res = await Reservation.find({member: req.user.userId})
      return res.json({userReserves: res.data}) 
    } catch (error) {
      res.status(404).json({error: error.message})
      
    }
  })

 
//reserve a book
  router.post('/reserve/:_id',async(req,res)=>{
    
      //check if any copies of book are available
      const {_id} = req.params
      const book = await Book.findById({_id})
      console.log(book.availableCopies);
      if(book.availableCopies < 1){
        return res.status(400).json({error: 'no copies available  , please try again some time'})
      }

      //check for any fines
    const fines = await getFines(req.user.userId)
      if(fines && fines.length > 1){
        res.redirect(200,'payFine')
      }

         const userReserves = await Reservation.find({member: req.user.userId})
         
         if(userReserves.length >= 1)  {
           //check if max reserves is reached
                if(userReserves.length == MAX_RESERVATIONS){
                  console.log('max');
                  return res.status(400).json({error: 'reserved enough books'})
                }
             //check if reserved book already
                console.log('>1');
                const reserved_book_already = userReserves.filter(item =>JSON.stringify(item.book) === JSON.stringify(book._id) )
                if(reserved_book_already.length>1){
                  console.log('alredady have');
                  return res.status(400).json({error: 'you have the book already in your cart'})
                }
            
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
      const user = await User.findById(req.user.userId)
      user.reservations += 1;
      await user.save()
       await book.save();                           

    return res.status(200).json({success: true, new_reservation,user})
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
