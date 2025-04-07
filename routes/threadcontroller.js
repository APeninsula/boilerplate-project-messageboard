'use strict';

const shared = require('../shared/shared');
const BoardData = require('../shared/boarddata');
const SingletonBoardData = new BoardData();

const postThreadtoBoard = async function(req,res,next){
    const board = !!(req.body.board) ? req.body.board : req.params.board;
    const newThread = shared.generateEmptyThread();
    newThread.text = req.body.text;
    newThread.delete_password = req.body.delete_password;
    SingletonBoardData.addThreadToBoard(board, newThread)
    res.redirect(`/b/${board}/`);
    next();
};

const getRecentThreads = async function(req,res,next){
    const threads = SingletonBoardData.getThreadsFromBoard(req.params.board);
    if(threads == null){
        res.send("No Threads found on this board");
        next();
        return;
    }
    const printableThreads = threads.map(thread =>SingletonBoardData.reduceThreadForMessage(thread));
    if(printableThreads.length > 10){
        printableThreads.length = 10;
    }
    res.send(printableThreads);
    next();
};

const deleteThreadContents = async function(req,res,next){
    const board = !!(req.body.board) ? req.body.board : req.params.board;
    const didDeleteThread = SingletonBoardData.deleteThreadFromBoard(board,req.body.thread_id,req.body.delete_password);
    const message = didDeleteThread ? "success" : "incorrect password";
    res.send(message);
    next();
};

const putReportThread = async function(req,res,next){
    const board = !!(req.body.board) ? req.body.board : req.params.board;
    const reported_id = !!req.body.report_id ? req.body.report_id : req.body.thread_id;
    const didReportThread = SingletonBoardData.reportThread(board,reported_id);
    if(!didReportThread){
        console.error("An issue occured while attempting to report the thread.");
        res.status(500).send("Error: Unable to report the thread");
        res.end();
        return;
    }
    res.send( "reported");
    next();
};
module.exports = {postThreadtoBoard, getRecentThreads, deleteThreadContents, putReportThread};