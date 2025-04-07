'use strict';

const generateRandomId = function(){
    var retVal = ""
    const idComplexity = 5;
    crypto.getRandomValues(new Uint32Array(idComplexity)).forEach(val => retVal += val.toString(16));
    return retVal;
};

const generateEmptyThread = function(){
    const timestamp = new Date().toISOString();
    return {
        _id: generateRandomId(),
        created_on:timestamp,
        text:"", 
        bumped_on:timestamp, 
        reported: false,
        delete_password:"", 
        replies:new Map() 
    };
};

const generateEmptyReply = function(){
    const timestamp = new Date().toISOString();
    return {
        _id: generateRandomId(),
        text:"",
        delete_password:"",
        created_on:timestamp,
        reported:false,
    }
};
module.exports = {generateEmptyReply, generateEmptyThread};