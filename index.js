const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('connect-flash')
const path = require('path')
const localStrategy = require('passport-local')
const methodOverride = require('method-override')
const session = require('express-session')
const app = express();
const User = require('./models/user')


// mongodb setup
mongoose.connect('mongodb+srv://nitinmeena915:7n8G9TcdEhgpj65n@cluster1.yvphvo6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1')
.then(()=>{
    console.log('Database connected')
}).catch((err)=>{
    console.log(err)
})

// session setup
app.use(
    session({
        secret: '1674CCAED412454DED99F54F398D9',
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            // secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 2
        }
    })
);


// passportsetup
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// ! server setup   
// flash setup
app.use(flash())
// Serving Static Files
app.use(express.static(path.join(__dirname, 'public')));

// form data parsing
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'))

app.set('view engine', 'ejs');


app.use((req,res,next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user
    next()
})

app.get('/',(req,res)=>{
    res.render('C:/work_place/Assignments/pythonAssignment/views/index.ejs')
})

const authRoutes = require('./routes/auth')
app.use(authRoutes)

// Handle all other GET requests
app.get('*', (req, res) => {
    req.flash('error','Error 404')
    res.redirect('/'); 
});

app.listen(8000,()=>{
    console.log('server is running on port 8000')
})