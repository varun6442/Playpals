const mongoose = require('mongoose');

const Schema = mongoose.Schema;


/**
 * Creating User Schema for the mongodb
 */
const UserSchema = new Schema({

    //declaring the fields that are needed in order to map to the database(mongodb)
    name: {

        type: String,   //the datatype of the field is defined

        required: true   //this is a mandatory field

    },

    email: {

        type: String,

        required: true

    },

    password: {

        type: String,

        required: true

    },

    date: {

        type: Date,

        default: Date.now   //Here the default value is defined if in case no value is provided by the user then this default is assigned

    },

    phone: {

        type: Number,

        required: true
    }

});


/**
 * Creating the mongoose model of user out of the Schema and then exporing it so that it can be used in the main Application
 */
module.exports = User = mongoose.model('users', UserSchema);