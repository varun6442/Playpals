const express = require('express');
const router = express.Router();
const passport = require('passport');
const validateCommentInput = require('../../validation/comments');
const Event = require('../../models/Event');
const Notification = require('../../models/Notification');

router.post('/:id/comments', passport.authenticate('jwt', {session: false}), (req, res) => {
    Event.findById(req.params.id)
        .populate('user', ['name'])
        .then(event => {
            const {errors, isValid} = validateCommentInput(req.body);
            
            if(!isValid){
                return res.status(400).json(errors);
            }
            
            const newNotification = new Notification({
                userID: event.userName._id,
                authorID: req.user.id,
                authorName: req.user.name,
                text: "comment your event"
            });
            
            const newComment = {
                text: req.body.text,
                name: req.user.name,
                user: req.user.id
            };
            
            event.comments.unshift(newComment);
            
            event.save()
                .then(event => {
                    newNotification.save();
                    return res.json(event);
                });
        });
});

router.delete('/:id/comments/:com_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Event.findById(req.params.id)
        .populate('user', ['name'])
        .then(event => {
            if(event.userName._id.toString() !== req.user.id){
                return res.status(401).json({notauthorized: 'User not authorized'});
            }
            
            const removeIndex = event.comments
                .map(item => item.id)
                .indexOf(req.params.com_id);
                
            event.comments.splice(removeIndex, 1);
            
            event.save()
                .then(event => res.json(event));
        })
        .catch(err => res.status(500).json(err));
});

module.exports = router;