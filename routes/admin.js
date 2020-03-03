const express = require('express')
const router = express.Router()

const Book = require('../models/Book')


//test
router.get('/',(req,res)=>{
    res.status(200).json({admin:"im him"})
})

module.exports = router;