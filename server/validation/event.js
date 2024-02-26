const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data){
    let errors = {};

    data.eventName = !isEmpty(data.eventName) ? data.eventName: '';
    data.sportType = !isEmpty(data.sportType) ? data.sportType: '';
    data.playerStrength = !isEmpty(data.playerStrength) ? data.playerStrength: '';
    
    if(Validator.isEmpty(data.eventName)){
        errors.eventName = 'Name of event is required';
    }
    
    if(Validator.isEmpty(data.sportType)){
        errors.sportType = 'Type of sport field is required';
    }
    
    if(!Validator.isNumeric(data.playerStrength)){
        errors.playerStrength = 'Must be a number';
    }
    
    if(Validator.isEmpty(data.playerStrength)){
        errors.playerStrength = 'Number of player field is required';
    }
    else if(data.playerStrength <= 1){
        errors.playerStrength = 'Must be at least 2 players';
    }
    else if(data.playerStrength > 100){
        errors.playerStrength = 'Must be less than 100 players';
    }
    
    if(!isEmpty(data.imageURL)){
        if(!Validator.isURL(data.imageURL)){
            errors.imageURL = 'Not a valid URL';
        }
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    };
};