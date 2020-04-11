const router = require('express').Router()
const Book = require('../models/Book')


// view all books
router.get('/', async(req,res)=>{
   try {
    const books = await Book.find();
    return  res.json({books})
   } catch (error) {
       return res.json({error})
   }
})

module.exports = router;