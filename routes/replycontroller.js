'use strict';

const shared = require('../shared/shared');
const BoardData = require('../shared/boarddata');
const SingletonBoardData = new BoardData();

const postReply = async function(req,res,next){
    const board = !!(req.body.board) ? req.body.board : req.params.board;
    const reply = shared.generateEmptyThread();
    reply.text = req.body.text;
    reply.delete_password = req.body.delete_password;
    const updatedThread = SingletonBoardData.addReplyToThread(board,req.body.thread_id,reply)
    if(!updatedThread){
        res.status(500).send("Error posting reply");
        res.end();
        return;
    }
    res.redirect(`/b/${board}/${req.body.thread_id}`);
    next();
};

const getThreadContents = async function(req,res,next){
    const board = !!(req.query.board) ? req.query.board : req.params.board;
    const thread = SingletonBoardData.getThreadFromBoard(board,req.query.thread_id);
    const reducedThread = SingletonBoardData.reduceThreadForMessage(thread);
    res.send(reducedThread);
    next();
};

const deleteReplyContents = async function(req,res,next){
    const board = !!(req.body.board) ? req.body.board : req.params.board;
    const isDeleteSuccess = SingletonBoardData.deleteReplyFromThread
        (board,req.body.thread_id,req.body.reply_id, req.body.delete_password);
    const message = isDeleteSuccess ? "success" : "incorrect password";
    res.send(message);
    next();
};

const putReportReply = async function(req,res,next){
    const board = !!(req.body.board) ? req.body.board : req.params.board;
    const didReportReply= SingletonBoardData.reportThread(board,req.body.thread_id, req.body.reply_id);
    if(!didReportReply){
        console.error("An issue occured while attempting to report the thread.");
        res.status(500).send("Error: Unable to report the thread");
        res.end();
        return;
    }
    res.send("reported");
    next();
};

module.exports = {postReply, getThreadContents, deleteReplyContents, putReportReply};