const {Router} = require('express')
const router = Router();

  //test 
  /*
member routes
1. borrow books
2. view all books
3. edit own profile
4. add a review
5. pay up credits
6. pay membership fees
*/

  router.get('/',(req,res)=>{
      res.status(200).json({msg:'im signed in'})
  })

module.exports = router;






































module.exports = router;