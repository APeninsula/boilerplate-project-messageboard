// Random ID generator
// base Board Generator
// Make a singleton instance of the Board Map initiator, make sure that you can only have one Board Data instance by altering its constructor

const generateRandomId = function(){
    var retVal = ""
    const idComplexity = 5;
    crypto.getRandomValues(new Uint32Array(idComplexity)).forEach(val => retVal += val.toString(16));
    return retVal;
};

export const generateEmptyThread = function(){
    const timestamp = new Date().toString();
    return {
        _id: generateRandomId(),
        created_on:timestamp, //"Date Timestamp with Hours and Minutes"
        text:"", // text of post
        bumped_on:timestamp, // "Date Timestamp that gets updated from last update"
        reported: false,
        delete_password:"", //password to delete post
        replies:[] //"array of reply objects"
    };
};

export const generateEmptyReply = function(){
    const timestamp = new Date().toString();
    return {
        _id: generateRandomId(),
        text:"",
        delete_password:"",
        created_on:timestamp,
        reported:false,
    }
};