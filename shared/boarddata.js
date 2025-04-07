'use strict';

class BoardData {
    static _boardMap;
    static _instance;
    constructor(){
        if(BoardData._instance){
            console.info("Cannot make more than one instance of BoardData");
            return BoardData._instance;
        } else{
            BoardData._instance = this;
            BoardData._boardMap = new Map();
        }
    }
    getBoardMap = function(){
        return BoardData._boardMap;
    }
    getThreadsFromBoard = function(boardName){
        try {
            const values = this.getBoardMap().get(boardName).values();
            const retVal = Array.from(values).sort(function(itemA,itemB){
                return (itemA.bumped_on < itemB.bumped_on) ? 1 : ((itemA.bumped_on > itemB.bumped_on) ? -1 : 0);
            });
            return retVal;
        } catch (error) {
            console.error(error)
            return null;
        }
    }
    getThreadFromBoard = function(boardName, threadId){
        try {
            return this.getBoardMap().get(boardName).get(threadId);
        } catch (error) {
            console.error(error)
            return null;
        }
    }
    getReplyFromThread = function(boardName, threadId, replyId){
        try {
            return this.getThreadFromBoard(boardName,threadId).replies.get(replyId);
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    addThreadToBoard = function(boardName, thread){
        try {
            if(this.getBoardMap().has(boardName)){
                this.getBoardMap().get(boardName).set(thread._id, thread);
            }else{
                this.getBoardMap().set(boardName, new Map([[thread._id,thread]]));
            }
            return this.getBoardMap().get(boardName);
        } catch (error) {
            console.error(error)
            return null;
        }
    }
    addReplyToThread = function(boardName, threadId, reply){
        try {
            const thread = this.getThreadFromBoard(boardName,threadId);
            thread.replies.set(reply._id,reply)
            thread.bumped_on = new Date().toISOString();
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    deleteThreadFromBoard = function(boardName, threadId, passkey){
        try {
            const thread = this.getThreadFromBoard(boardName,threadId);
            if(passkey===thread.delete_password){
                this.getBoardMap().get(boardName).delete(threadId);
                return true;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    deleteReplyFromThread = function(boardName, threadId, replyId, passkey){
        try {
            const reply = this.getReplyFromThread(boardName,threadId,replyId);
            if(reply.delete_password === passkey){
                reply.text = "[deleted]"
                return true;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    reduceThreadForMessage = function(thread){
        try {
             var convertedReplies = !!thread.replies ? Array.from(thread.replies.values()) : [];
            if(convertedReplies.length > 0){
                convertedReplies = convertedReplies.map(reply=>this.reduceReplyForMessage(reply));
            }
            return {
                _id: thread._id,
                text:thread.text,
                created_on: thread.created_on,
                bumped_on: thread.bumped_on,
                replies: convertedReplies,
                replycount: convertedReplies.length
            };
        } catch (error) {
            console.error(error);
        }
    }
    reduceReplyForMessage = function(reply){
        try {
            return {
                _id: reply._id,
                text: reply.text,
                created_on:reply.created_on
            }
        } catch (error) {
            console.error(error);
        }
    }
    reportThread = function(boardName, threadId){
        try {
            const thread = this.getThreadFromBoard(boardName,threadId);
            if(thread === null){
                console.error("Error: thread with ", threadId, "not found on board", boardName);
                return false;
            }
            thread.reported = true;
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    reportReply = function(boardName, threadId, replyId){
        try {
            const reply = this.getReplyFromThread(boardName,threadId,replyId);
            if(reply === null){
                console.error("Error: reply with id:",replyId," under thread with id:", threadId, "not found on board", boardName);
                return false;
            }
            reply.reported = true;
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
};

module.exports = BoardData;