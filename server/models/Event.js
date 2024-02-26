const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Creating Event Schema for the mongodb
 */
const EventSchema = new Schema({
    userName: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    eventName: {
        type: String,
        required: true
    },
    sportType: {
        type: String,
        required: true
    },
    playerStrength: {
        type: Number,
        required: true
    },
    playerList: [
        {
            id: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        }
    ],
    location: {
        type: String
    },
    address: {
        type: {
            type: String,
            enum: ["Point"]
        },
        coordinates: {
            type: [Number],
            index: "2dsphere"
        }
    },
    description: {
        type: String
    },
    imageURL: {
        type: String
    },
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    currentDate: {
        type: Date,
        default: Date.now
    },
    eventDate: {
        type: Date,
    },
    status: {
        type: Boolean,
        default: false
    }
});


/**
 * Creating the model out of the Schema and then exporing it so that it can be used in the main Application
 */
module.exports = Event = mongoose.model('event', EventSchema);