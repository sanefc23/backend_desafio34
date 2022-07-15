const User = require('../db/User')
const bcrypt = require("bcrypt");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const logger = require('../services/logger');

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser((email, done) => {
    let user = User.findOne({
        email: email
    });
    done(null, user);
});

passport.use('login', new LocalStrategy({
        usernameField: 'userName',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, userName, password, done) {
        logger.info(req.route);
        User.findOne({
                email: userName
            },
            (err, user) => {
                if (err)
                    return done(err);
                if (!user) {
                    message = `User not found with email: ${userName}`;
                    req.flash('User not found with email: ', userName);
                    return done(null, false, req.flash('User not found!'))
                }
                if (!bcrypt.compareSync(password, user.password)) {
                    message = 'Invalid Password';
                    console.log('Invalid Password');
                    return done(null, false, req.flash('Invalid Password'))
                }
                return done(null, user);
            }
        )
    }
));

passport.use('register', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, email, password, done) {
        logger.info(req.route);
        User.findOne({
                email: email
            },
            (err, user) => {
                if (err) {
                    req.flash('Register error: ', err);
                    return done(err);
                }
                if (user) {
                    message = 'User already exists!'
                    return done(null, false, req.flash('User already exists'));
                } else if (password === req.body.passwordCheck) {
                    let encrytedPassword = bcrypt.hashSync(password, 10);
                    let user = {
                        ...req.body,
                        password: encrytedPassword
                    }
                    User.create(user)
                    return done(null, user);
                } else {
                    message = 'Passwords do not match!'
                    return done(null, false, req.flash('Passwords do not match!'));
                }
            }
        )
    }
));

const userController = {
    failedLogin: (req, res) => {
        logger.info(req.route);
        res.render('index', {
            failedLogin: true,
            message: message
        })
    },
    registerView: (req, res) => {
        logger.info(req.route);
        res.render('index', {
            registerView: true
        })
    },
    failedRegister: (req, res) => {
        logger.info(req.route);
        res.render('index', {
            failedLogin: true,
            message: message
        })
    },
    logout: (req, res) => {
        logger.info(req.route);
        req.session.destroy()
        res.redirect('/');
    }
}

module.exports = userController