'use strict';

const generateEmptyReply = require('../shared/shared')
// Should make some Controllers and handlers
// Do we make a database for the board and threads?
// Use JSON stringify() to pass the thread and board data
// Board Data structure: Map of Boards, Each key has a value of a thread object, each thread object has an array of reply objects
// const threadTemplate = {
//   _id:"randomlygennedId",
//   created_on:"Date Timestamp with Hours and Minutes",
//   text:"text of post",
//   bumped_on:"Date Timestamp that gets updated from last update",
//   reported:"boolean",
//   delete_password:"password to delete post",
//   replies:["array of reply objects"]
// }
// const replyTemplate = {
//   text:"text of post",
//   delete_password:"password to delete post",
//   created_on:"Date Timestamp with Hours and Minutes",
//   reported:"boolean",
//   _id:"randomlygennedId",
// }

export const postReply = async function(req,res,next){
    res.send(new Promise("NOT YET IMPLEMENTED - create a new reply to a thread on the anonymous forum."));
    next();
};

export const getThreadContents = async function(req,res,next){
    res.send(Promise("NOT YET IMPLEMENTED - return the entirety of the thread's contents from the requested thread's id."));
    next();
};

export const deleteReplyContents = async function(req,res,next){
    res.send(Promise("NOT YET IMPLEMENTED - Should return a message 'incorrect password' or 'success'. Text of the reply's id should change to 'deleted'"));
    next();
};

export const putReportReply = async function(req,res,next){
    res.send(Promise("NOT YET IMPLEMENTED - return 'reported' and update the reported value of the reply to true"));
    next();
};