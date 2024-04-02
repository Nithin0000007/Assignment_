const express = require('express')
const router = express.Router()
const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcrypt');

// middleware 

const checkloggedIn = (req, res, next) => {
    if (req.isAuthenticated()) next()
    else {
        req.flash('error', 'You need do be logged in to do that')
        res.redirect('/login')
    }
}


router.get('/signup', (req, res) => {
    res.render('../views/user/signup');
})

router.post('/signup', async (req, res) => {
    try {
        const newUser = new User({
            username: req.body.username,
            mobNo: req.body.phone,
        })
        let registeredUser = await User.register(newUser, req.body.password)
        req.login(registeredUser, (err) => {
            if (err) {
                req.flash('error', 'Something went wrong while signing you up, please try again later')
                res.redirect('/')
            }
            req.flash('success', 'Registration Successful')
            res.redirect('/')
        })
    } catch (error) {
        req.flash('error', 'user with the given username is already registered')
        res.redirect('/jobs')
    }
})

router.get('/login', (req, res) => {
    res.render('../views/user/login')
})



router.post(
    '/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true,
    }),
    (req, res) => {
        req.flash('success', 'Welcome back user')
        res.redirect('/')
    })

router.get('/logout', checkloggedIn, (req, res) => {
    req.logout((err) => {
        if (err) {
            req.flash('error', 'Something went wrong while logging you out')
            console.log(err)
            res.redirect('/')
        } else {
            req.flash('success', 'Logged out successfully')
            res.redirect('/')
        }
    })
})


router.get('/users/:id', checkloggedIn, async (req, res) => {
    try {
        const userDetails = await User.findById(req.params.id)
        res.render('../views/user/show', { userDetails })
    } catch (error) {
        req.flash('error', 'something went wrong, try again')
        console.log(error)
        res.redirect('/')
    }
})

router.get('/users/:id/change-password', async(req, res) => {
    const userDetails = await User.findById(req.params.id)
    res.render('../views/user/change',{userDetails})
})

router.post('/users/:id', async (req, res) => {
    try {
        const { newPassword } = req.body;

        // Get the authenticated user from the request object
        const user = req.user;

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in the database
        user.password = hashedPassword;
        await user.save();
        req.flash('success', 'password changed successfully')
        res.redirect('/')
    } catch (error) {
        req.flash('error', 'something went wrong, try again')
        console.log(error)
        res.redirect(`/`)
    }
})


router.delete('/users/:id', checkloggedIn, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        req.flash('success', 'user deleted successfully')
        res.redirect('/')
    } catch (error) {
        req.flash('error', 'something went wrong, try again')
        console.log(error)
        res.redirect('/')
    }
})


module.exports = router