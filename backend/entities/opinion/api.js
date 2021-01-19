// controllers
const getAllOpinions = require('./controller').getAllOpinions;
const createOpinion = require('./controller').createOpinion;
const deleteOpinion = require('./controller').deleteOpinion;
const passport = require('passport');

/**
 * opinion apis
 */
const opinionAPI = (app) => {
  // create an opinion
  app.post('/api/opinion/newOpinion', passport.authenticate('jwt', { session: false }),(req, res) => {
    if(req.user) {
      createOpinion(req.body).then(
        (result) => { res.send(result); },
        (error) => { res.send(error); }
      );
    } else {
      res.send({ authenticated: false });
    }
  });

  // remove an opinion
  app.delete('/api/opinion/deleteOpinion/:opinion_id',passport.authenticate('jwt', { session: false }), (req, res) => {
    if(req.user) {
      deleteOpinion(req.params.opinion_id).then(
        (result) => { res.send({ deleted: true }); },
        (error) => { res.send({ deleted: false }); }
      );
    }
  });
};

module.exports = opinionAPI;
