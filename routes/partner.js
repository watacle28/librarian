const express = require('express')
const router = express.Router()

//test
router.get('/',(req,res)=>{
    res.status(200).json({msg: 'welcome partner'})
})

module.exports = router;