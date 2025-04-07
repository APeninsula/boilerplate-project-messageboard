'use strict';
const threadController = require('./threadcontroller');
const replyController = require('./replycontroller');

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
