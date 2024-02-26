const express = require('express');
const router = express.Router();
const passport = require('passport');

const Profile = require('../../models/Profile');
const validateProfileInput = require('../../validation/profile');

router.get('/', passport.authenticate('jwt', {session: false}),(req, res) => {
    const errors = {};
    Profile.findOne({profileUserName: req.user.id})
        .populate('user', ['name'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'Profile does not exist for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(500).json(err));
});

router.post('/', passport.authenticate('jwt', {session: false}),(req, res) => {
    const {errors, isValid} = validateProfileInput(req.body);
    
    if(!isValid){
        return res.status(400).json(errors);
    }
    
    const profileFields = {};
    profileFields.profileUserName = req.user.id;
    
    if(req.body.profileUserHandle) profileFields.profileUserHandle = req.body.profileUserHandle;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    
    if(typeof req.body.favoriteSport !== 'undefined'){
        profileFields.favoriteSport = req.body.favoriteSport.split(',');
    }
    
    Profile.findOne({profileUserName: req.user.id}).then(profile => {
        if(profile){
            Profile.findOneAndUpdate(
                {profileUserName: req.user.id},
                {$set: profileFields},
                {new: true}
            ).then(profile => res.json(profile));
        }
        else{
            Profile.findOne({profileUserHandle: profileFields.profileUserHandle}).then(profile => {
                if(profile){
                    res.status(400).json({errors: 'profileUserHandle already exists'});
                }
                new Profile(profileFields).save().then(profile => res.json(profile));
            });
        }
    });
});


router.get('/user/:user_id', (req, res) => {
    const errors = {};
    
    Profile.findOne({user: req.params.user_id})
        .populate('user', ['name'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'User does not exist';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => 
            res.status(500).json({ errors: err })
        );
});

module.exports = router;