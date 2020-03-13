require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const manageFines = require('./utils/manageFines')

require('colors')
const PORT = process.env.PORT | 3002


//import routes
const authRoute = require('./routes/auth')
const userRoute = require('./routes/member')
const membersRoutes = require('./routes/member')
const partnerRoutes = require('./routes/partner')
const {adminRoutes} = require('./routes/admin')

//import custom middleware
const members = require('./middleware/auth')
const partnerLevel = require('./middleware/partners')
const adminLevel = require('./middleware/admin')

const app = express()

//add middleware
app.use(express.json())

//define public routes middleawre
app.use('/api/auth',authRoute)
app.use('/api/user', userRoute)

//combine level check middleware
const partnerCheck = [members,partnerLevel]
const admin = [members,partnerLevel,adminLevel]
//const totalfines = fines.reduce((acc, fine)=> acc + fine)
 
/*ROUTES MIDDLEWARE*/
//routes for members
app.use('/api/members',members, membersRoutes)
//routes for partners and librarian only
app.use('/api/partners',...partnerCheck,partnerRoutes)
//routes for librarian
app.use('/api/admin',...admin,adminRoutes)
//cron.schedule('' ,()=>{console.log('hi')})
//connect db
mongoose.connect(process.env.MONGOURI,{useCreateIndex: true,useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('db coonnected'.bgMagenta.bold)

})

//initialize server
app.listen(PORT,()=>{
    console.log(`server running at http://localhost:${PORT}`.bgCyan.bold)
})