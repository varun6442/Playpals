const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    profileUserName: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    profileUserHandle: {
        type: String,
        required: true,
        max: 40
    },
    profileLocation: {
        type: String
    },
    favoriteSport: {
        type: [String],
        required: true
    },
    bio: {
        type: String
    },
    profileCreatedDate:{
        type: Date,
        default: Date.now
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);