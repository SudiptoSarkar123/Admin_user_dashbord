const express = require('express')
const app = express()
const path = require('path')
const dotenv = require('dotenv').config()
const session = require('express-session')
const flash = require('connect-flash');
const dbcon = require('./app/config/dbCon')
dbcon()

// Configure session middleware
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true}))

    app.use(flash());

    app.use((req,res,next)=>{
        res.locals.messages = req.flash();
        next()
    })

app.set('views','views')
app.set('view engine','ejs')

const cookieParser = require('cookie-parser')
app.use(cookieParser())


app.use(express.json())
app.use(express.urlencoded({extended:false}))


// For Static files
app.use("/uploads",express.static(path.join(__dirname,'uploads')));

const apiRouter = require('./app/router/apiRout')
const staticRouter = require('./app/router/staticRout')

app.use('/api',apiRouter)
app.use('/api',staticRouter)


// Start the serveer 
const PORT = process.env.PORT || 4005 ;
app.listen(PORT,()=>{
    console.log('Server is running at ',PORT)
})








