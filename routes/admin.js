const express = require('express')
const router = express.Router()

const Book = require('../models/Book')

/*librarian routes
1. add book to library
2. assign roles
3. view all members
4. access account info
5. all the below
6. set overdue fees per day
7. set membership fees
*/
//test
router.get('/',(req,res)=>{
    res.status(200).json({admin:"im him"})
})

module.exports = router;