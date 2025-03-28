'use strict';
const threadController = require('./threadcontroller');
const replyController = require('./replycontroller');
// Should make some Controllers and handlers
// Do we make a database for the board and threads?
// Use JSON stringify() to pass the thread and board data
// Board Data structure: Map of Boards, Each key has a value of a thread object, each thread object has an array of reply objects
// All controller handlers should be ASYNC
const BoardData = new Map().set("b", new Map());

module.exports = function (app) {
  
  app.route('/api/threads/:board')
  .post(threadController.postThreadtoBoard)
  .get(threadController.getRecentThreads)
  .put(threadController.putReportThread)
  .delete(threadController.deleteThreadContents);
    
  app.route('/api/replies/:board')
  .post(replyController.postReply)
  .get(replyController.getThreadContents)
  .put(replyController.putReportReply)
  .delete(replyController.deleteReplyContents);

};
