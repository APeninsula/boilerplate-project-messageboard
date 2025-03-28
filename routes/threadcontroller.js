'use strict';

const generateEmptyThread = require('../shared/shared')
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

export const postThreadtoBoard = async function(req,res,next){
    res.send(new Promise("NOT YET IMPLEMENTED - create a new thread to a board on the anonymous forum."));
    next();
};

export const getRecentThreads = async function(req,res,next){
    res.send( new Promise("NOT YET IMPLEMENTED - return the 10 most recently bumped threads from the requested board."));
    next();
};

export const deleteThreadContents = async function(req,res,next){
    res.send(new Promise("NOT YET IMPLEMENTED - Should return a message 'incorrect password' or 'success'. Text of the thread's id should change to 'deleted'"));
    next();
};

export const putReportThread = async function(req,res,next){
    res.send(new Promise("NOT YET IMPLEMENTED - return 'reported' and update the reported value of the thread to true"));
    next();
};