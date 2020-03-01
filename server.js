const express = require('express')
const mongoose = require('mongoose')
require('colors')
const PORT = process.env.PORT | 3002
require('dotenv').config()

const app = express()

//add middleware
app.use(express.json())


//connect db
mongoose.connect(process.env.MONGOURI,{useCreateIndex: true,useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('db coonnected'.green)

})

//initialize server
app.listen(PORT,()=>{
    console.log(`server running at http://localhost:${PORT}`.bgGreen)
})