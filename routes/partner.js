const express = require('express')
const router = express.Router()

/*
partner routes
1. add book to library
2. borrow books
3. view all books
4. add a review
5. pay partner fee
6. view earnings in realtime  //earn per every owned book borrowed + overdue fees

*/
//test
router.get('/',(req,res)=>{
    res.status(200).json({msg: 'welcome partner'})
})

module.exports = router;