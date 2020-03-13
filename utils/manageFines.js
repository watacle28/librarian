const cron = require('node-cron')
const BookCopy = require('../models/BookCopy')
const {FINE_PER_DAY} = require('../utils/constants')

const Fine = require('../models/Fine')

const manageFines = async()=>{
const borrowedCopies = await BookCopy.find({Availability: false})
// automaticaly initialize fines for all overdue copies
    
 borrowedCopies.map((copy)=>{

      let date = copy.ReturnDate.getDate() + 1
     let month = copy.ReturnDate.getMonth() + 1
    
     cron.schedule(`0 0 ${date} ${month} *`, async()=>{
        const newFine = await new Fine({
                 amount : FINE_PER_DAY,
                 copy: copy._id
             }).save()
            res.json({newFine})
     })
 })

 //get all fines and add R20 at 00.00 everyday
     const fines = await Fine.find();
     if(fines && fines.length > 1){
         return Promise.all(fines.map((fine)=>{
            cron.schedule('0 0 * * *',async()=>{
            fine.amount += FINE_PER_DAY 
            await fine.save()
            res.json({fine})
            }
            )
        }))
       

     }
     

}
module.exports = manageFines