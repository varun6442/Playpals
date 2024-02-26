const express = require('express');
const router = express.Router();
const passport = require('passport');
const validateEventInput = require('../../validation/event');
const Event = require('../../models/Event');
const Notification = require('../../models/Notification');

router.get('/all', (req, res) => {
    Event.find()
        .sort('-date')
        .populate('userName', ['name'])
        .then(events => {
            res.json(events);
        })
        .catch(err =>
            res.status(404).json({ error: "Error in get api/events/all. " + err })
        );
});

router.get('/events', (req, res) => {
    Event.find(req.query.sport ? { sportType: req.query.sport, status: false } : { status: false })
        .sort('-date')
        .populate('userName', ['name'])
        .then(events => {
            res.json(events);
        })
        .catch(err =>
            res.status(404).json({ error: "Error in get api/events/events. " + err })
        );
});

router.get('/:id', (req, res) => {
    Event.findById(req.params.id)
        .populate('userName', ['name'])
        .then(event => res.json(event))
        .catch(err =>
            res.status(404).json({ error: "Error in get api/events/:id. " + err })
        );
});

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateEventInput(req.body);
    const event_Id = req.query.eventId;
    console.log("Player Strength", req.body.playerStrength);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const eventFields = {};
    eventFields.userName = req.user.id;

    if (req.body.eventName) eventFields.eventName = req.body.eventName;
    if (req.body.sportType) eventFields.sportType = req.body.eventName;
    if (req.body.playerStrength) eventFields.playerStrength = parseInt(req.body.playerStrength);
    if (req.body.location) eventFields.location = req.body.location;
    if (req.body.description) eventFields.description = req.body.description;
    if (req.body.imageURL) eventFields.imageURL = req.body.imageURL;
    if (req.body.eventDate) eventFields.eventDate = req.body.eventDate;

    Event.findById(event_Id)
        .then(event => {
            // update an event
            if (event) {
                if (req.body.eventName) event.eventName = req.body.eventName;
                if (req.body.sportType) event.sportType = req.body.sportType;
                if (req.body.playerStrength) event.playerStrength = req.body.playerStrength;
                if (req.body.location) event.location = req.body.location;
                if (req.body.description) event.description = req.body.description;
                if (req.body.imageURL) event.imageURL = req.body.imageURL;
                if (req.body.eventDate) event.eventDate = req.body.eventDate;

                return event.save().then(event => res.json(event));;
            }
            // create a new event
            else {
                new Event(eventFields).save().then(event => res.json(event));
            }
        })
});

router.put('/:id/join',passport.authenticate('jwt', { session: false }), (req, res) => {
    let newNotification;
    console.log("USERNAME", req.user);
    Event.findById(req.params.id)
        .populate('userName', ['name'])
        .then(event => {
            if (!event) {
                return res.status(404).json({ error: 'This event is not found' });
            }

            let count = 0;

            for (let i of event.playerList) {
                if (i["id"] === req.user.id) {
                    return res.status(400).json({ error: 'You already join this event' });
                }
                count++;
            }

            if (count >= event.playerStrength) {
                return res.status(400).json({ error: 'This event is full' });
            }

            const userName = req.user.name;

            const newPlayer = {
                id: req.user.id,
                name: userName
            };

            newNotification = new Notification({
                userID: event.userName._id,
                authorID: req.user.id,
                authorName: userName,
                text: "join your event"
            });

            event.playerList.push(newPlayer);
            return event.save();
        })
        .then(result => {
            newNotification.save();
            res.status(200).json({
                msg: 'Success on joining that event',
                event: result,
                join: "You are going to this event"
            });
        })
        .catch(err => res.status(500).json({ error: "Error in put api/events/:id/join. " + err }));
});

router.put('/:id/flag', (req, res) => {
    Event.findById(req.params.id)
        .populate('userName', ['name'])
        .then(event => {
            if (!event) {
                return res.status(404).json({ error: 'This event is not found' });
            }

            event.status = true;
            return event.save();
        })
        .then(result => {
            res.status(200).json({
                msg: 'Success on flagging that event',
                event: result
            });
        })
        .catch(err => res.status(500).json({ error: "Error in put api/events/:id/flag. " + err }));
});

router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Event.findById(req.params.id)
        .then(event => {
            if (event.userName.toString() !== req.user.id) {
                return res.status(401).json({ notauthorized: 'User not authorized' });
            }
            event.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(500).json({ error: "Error in delete api/events/:id. " + err }));
});

module.exports = router;