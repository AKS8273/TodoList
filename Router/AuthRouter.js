require('dotenv').config();
const express = require('express');
const Router = require('express').Router();
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt')
var GoogleStrategy = require("passport-google-oauth2").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const User = require("./../todoSchema/UserSchema");

Router.route('/').get((req, res) => {
    if (req.isAuthenticated()) {
        res.json(1);
    }
    else {
        res.json(0)
    }

})


// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

Router.route("/signUp").post((req, res) => {

    User.countDocuments({ username: req.body.username}).then(count => {
        if (count) {
            res.status(400).json({ name: "User already exist" });
        }
        else {
            User.register(new User({
                username: req.body.username,
            }),
                req.body.password,
                function (err, user) {
                if (err) {
                    console.log(err);
                    res.redirect("/");
                } else {
                    passport.authenticate("local")(req, res, function () {
                        res.status(200).json({
                            id: user._id,
                            username:user.username
                        });
                    });
                }
                }
            );
        }
    }).catch(err => {
        res.json(err)
    });
});


Router.route('/auth/google/home').post((req, res) => {
    console.log(req.body.username, req.body.googleId);

    User.findOrCreate({
        username: req.body.username,
        googleId: req.body.googleId
    })
        .then((user) => {
            console.log(user);
            console.log(user.doc._id);
            res.json({
                id:user.doc._id,
                username: user.doc.username,
            })
        })
        .catch((err) => console.log(err));
})

Router.route("/login").post((req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });

    User.countDocuments({ username: req.body.username }).
        then(count => {
            if (count) {
    if (!req.body.username) {
        res.json({ success: false, message: "Username was not given" })
    } else {
        if (!req.body.password) {
            res.json({ success: false, message: "Password was not given" })
        } else {
            passport.authenticate('local', function (err, user, info) {
                if (err) {
                    res.json(err);
                } else {
                    console.log(user);
                    if (!user) {
                        res.status(400).json("Incorrect Username or password")
                    } else {
                        req.login(user, function (err) {
                            if (err) {
                                res.json({ success: false, message: err })
                            } else {
                                res.json({
                                    id: user._id,
                                    username: user.username
                                });
                            }
                        })
                    }
                }
            })(req, res);
        }
    }
                }
                else {
                    res.status(400).json('invalid username or password')
                }
        }).catch(err => res.json(err));
        
    //  req.login(user, function (err) {
    //    console.log(user);
    //    if (err) {
    //      console.log(err);
    //      res.status(400).json(err);
    //    } else {
    //      passport.authenticate("local")(req, res, function (err) {
    //        if (err) {
    //          console.log("shiv");
    //          res.json(err);
    //        } else {
    //          res.json({
    //            id: user._id,
    //            username: user.username,
    //          });
    //        }
    //      });
    //    }
    //  });
});

Router.route("/logout").get((req, res) => {
    req.logOut();
    res.status(200).json('User logout successsfully');
});

module.exports = Router