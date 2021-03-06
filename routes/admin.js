const express = require('express')
const router = express.Router()
const cron = require('node-cron')
require('dotenv').config()

const uploader = require('../upload')

const Book = require('../models/Book')
const Fine = require('../models/Fine')
const BookCopy = require('../models/BookCopy')
const User = require('../models/User')

const Account = require('../models/Finance')


const {MAX_NUMBER_OF_BOOKs,LOAN_DAYS,FINE_PER_DAY} = require('../utils/constants')
const {rackId} = require('../utils/rackId')


//config cloudinary


/*librarian routes
1. add book to library
2. assign roles
3. view all members
4. access account info
5. all the below
6. set overdue fees per day
7. set membership fees
*/

//view all members
let count = 1
router.get('/members',async(req,res)=>{
    const members = await User.find();
   
   
    try {
        res.status(200).json({members})
        
    } catch (error) {
        res.status(404).json({error: 'no users found'})
    }
})

//add a book to library

router.post('/addBook',uploader.single('image'),async(req,res)=>{
  const  {name,numberOfPages,author} = req.body;
  const rackId = `myLibrary_${count++}`;
 
 const coverImg = req.file.url
 const newBook = await new Book({
    name,numberOfPages,coverImg,author,loanCount: 0,rackId
}).save();
  
 res.json({newBook})

})

//remove from book from library N.B must remove all subsequent copies


//add a copy
router.post('/copies/:bookId',async(req,res)=>{
    const {copyIds} = req.body;
    const book = await Book.findById({_id: req.params.bookId})
     
    let copies = [];
    copyIds.forEach(copy => {
        copies.push({
            copyId: copy.copyId,
            Book: book._id
        })
    });
    
    const newCopies = await BookCopy.insertMany(
        copies
    )
   book.totalCopies += copies.length 
   book.availableCopies += copies.length
    await book.save()

    res.status(200).json({success: true,  newCopies})
                        
})
 
//issue a copy to member
router.post('/checkout',async(req,res)=>{
  
  //get user and book in question
   const {copyId, email} = req.body;
   
   const user = await User.findOne({email}).populate('borrowed',['Book'])
   const copy = await BookCopy.findOne({copyId})
   const book = await Book.findById({_id: copy.Book})
   const reservations = book.reservations;
   const userReserve = reservations.indexOf(user._id)
   const books_borrowed = user.borrowed

 //check if copy of book is available
   if (book.availableCopies < 1){
       if(reservations.length < 1){ 
          return res.json({error: 'no copies left ,where the fuck did you get that',books_borrowed})
       }else{
 
          if(userReserve <= -1){
               return res.json({error: 'book has been reserved'})
           }
       }
               
   }
  
   
    // check if has book already
    const has_book_already = books_borrowed.filter(item =>JSON.stringify(item.Book) === JSON.stringify(book._id) )
   
    if(has_book_already.length >= 1){
        return res.json({error: 'you cant borrow the same book pliz'})
    }

// check if user has outstanding arrears
    const userFines = await Fine.findOne({member:user._id})
    if(userFines && userFines.length > 1){
        return res.json({error: 'you have fines outstanding',userFines})
    }

    //check if limit reached
    if(books_borrowed.length >= MAX_NUMBER_OF_BOOKs){
        return res.json({error: 'you have borrowed enough books, return some first'})
  }
  
    //process checkout
    //update user
   user.borrowed.push(copy)
   await user.save();
  
   //update book
   book.loanCount++;
   book.availableCopies--;
    //remove reservation
   reservations.splice(userReserve,1);
   await book.save();
   
   //update copy
   const IssueDate = new Date();
  
   const ReturnDate = new Date(new Date().setDate(new Date().getDate() + LOAN_DAYS))

   copy.ReturnDate = ReturnDate;
   copy.IssueDate  = IssueDate;
   copy.Availability = false;
   await copy.save();
   
  
 return res.json({success: true,user})
 })

router.post('/checkback',async(req,res)=>{
  const {copyId, payNow} = req.body;  
  const copyReturned = await BookCopy.findOne({copyId}).populate('Book',['availableCopies'])
 //check  all fines
const userFines = await Fine.find({member: req.user.userId})
if(userFines && payNow == true){res.redirect(301,'./members/payFine')}

 //add availableCopies
  copyReturned.Book.availableCopies ++;
  await copyReturned.Book.save()

 //mark copy available , set ReturnDate and IssueDate to null
 //save changes to db ie copy,fines, db
 copyReturned.Availability = true;
 copyReturned.ReturnDate = null;
 copyReturned.IssueDate = null;
 await copyReturned.save()

 return res.json({msg : `${copyReturned} has been returned to library`})
  
})

//remove a copy
router.delete('/deleteCopy',async(req,res)=>{
   const {copyId} = req.body
   const copyToGo = await BookCopy.findOneAndDelete({copyId})
  return res.json({msg: `${copyToGo.copyId} was deleted successfuly `})
})


//edit book
router.put('/edit/:bookId', async(req,res)=>{
    try {
      const book = await Book.findByIdAndUpdate({_id: req.params.bookId},{body},{new: true})
      res.json({book})
    } catch (error) {
      res.json({error})
    }
  })
//get lib financial status
exports.adminRoutes = router;

  

    
  
