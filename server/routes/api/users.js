const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

const validateRegisterInput = require('../../validation/register');
const validateUpdateInput = require('../../validation/update-input');
const validateLoginInput = require('../../validation/login');

const User = require('../../models/User');
const Notification = require('../../models/Notification');


router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                errors.email = 'Email Already Exists';
                return res.status(400).json(errors);
            }
            else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: req.body.password
                });

                const newNotification = new Notification({
                    userID: newUser._id,
                    text: "Welcome to Playpals, please create your profile."
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newNotification.save();
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                const payload = { id: user.id, name: user.name };

                                jwt.sign(
                                    payload,
                                    keys.secretOrKey,
                                    { expiresIn: 3600 },
                                    (err, token) => {
                                        res.json({
                                            success: true,
                                            token: 'Bearer ' + token
                                        });
                                    });
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
});


router.put('/register/update', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateUpdateInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findByIdAndUpdate(req.user.id)
        .then(user => {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    if (err) throw err;
                    user.password = hash;
                    user
                        .save()
                        .then(user => {
                            res.json(user);
                        })
                        .catch(err => console.log(err));
                });
            });
        });
});


router.patch('/login', (req, res) => {
    let errors = { email: '', password: '' }
    const email = req.body.email;
    const password = req.body.password;
    console.log("pass", req.body.password);
    User.findOne({ email })
        .then(user => {
            console.log("email", email);
            if (!user) {
                errors.email = 'User not found';
                return res.status(404).json(errors);
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const payload = { id: user.id, name: user.name };

                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            { expiresIn: 3600 },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                            });
                    }
                    else {
                        errors.password = 'Password Incorrect';
                        return res.status(400).json(errors);
                    }
                });
        });
});

router.patch('/loginWithOtp', (req, res) => {
    let errors = { phone: '' }
    const phone = req.body.phone;
    console.log("OTP", phone);
    User.findOne({ phone })
        .then(user => {
            if (!user) {
                errors.phone = 'User not found';
                return res.status(404).json(errors);
            }
            else {
                const payload = { id: user.id, name: user.name };
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    { expiresIn: 3600 },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        });
                    });
            }
        });
});



router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});


router.get('/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err =>
            res.status(500).json({ error: "Error in get api/users/:id. " + err })
        );
});

module.exports = router;