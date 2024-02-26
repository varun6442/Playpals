const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data){
    let errors = {};
    data.profileUserHandle = !isEmpty(data.profileUserHandle) ? data.profileUserHandle: '';
    data.favoriteSport = !isEmpty(data.favoriteSport) ? data.favoriteSport: '';
    if(!Validator.isLength(data.profileUserHandle, {min: 2, max: 40})){
        errors.profileUserHandle = 'profileUserHandle needs to be between 2 and 40 chararcters';
    }
    
    if(Validator.isEmpty(data.profileUserHandle)){
        errors.profileUserHandle = 'Profile profileUserHandle is mandatory';
    }
    
    if(Validator.isEmpty(data.favoriteSport)){
        errors.favoriteSport = 'Favorite Sport is mandatory';
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    };
};