//function checking if the given value is empty or null 
const isEmpty = (value) => 
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0);
    
module.exports = isEmpty;  //function is exported to be used 