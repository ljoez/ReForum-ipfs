// forum controllers
const getAllForums = require('./controller').getAllForums;
const getDiscussions = require('./controller').getDiscussions;
const passport = require('passport');

/**
 * forum apis
 */
const forumAPI = (app) => {
  // get all forums
  app.get('/api/forum', (req, res) => {
    getAllForums().then(
      (result) => { res.send(result); },
      (error) => { res.send(error); }
    );
  });

  app.get('/api/getNetworkStatus', (req, res) => {
    res.send("success"); 
  });


  // get discussions of a forum
  app.get('/api/forum/:forum_id/discussions', (req, res) => {
    getDiscussions(req.params.forum_id, false, req.query.sorting_method,req.query.pageNum).then(
      (result) => { res.send(result); },
      (error) => { res.send([]); }
    );
  });

  // get pinned discussions of a forum
  app.get('/api/forum/:forum_id/pinned_discussions', (req, res) => {
    getDiscussions(req.params.forum_id, true).then(
      (result) => { res.send(result); },
      (error) => { res.send([]); }
    );
  });
};

module.exports = forumAPI;
