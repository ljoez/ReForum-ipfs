const passport = require('passport');
const signIn = require('./controller').signIn;
const getFullProfile = require('./controller').getFullProfile;
const signInViaLocal = require('./controller').signInViaLocal;
const updateAvatar = require('./controller').updateAvatar;

/**
 * user apis
 */
const userAPI = (app) => {
  // get authenticated user
  app.get('/api/user/getUser',passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user) res.send(req.user);
    else res.send(null);
  });
  
  app.post('/api/user/updateAvatar',passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user) {
      updateAvatar(req.user.username,req.body.avatarImg).then(
        (result) => { res.send({ succ: true }); },
        (error) => { res.send({ succ: false }); }
      );
    } else {
      res.send({ succ: false });
    }
  });

  // github authentication route
  // app.get(
  //   '/api/user/authViaGitHub',
  //   passport.authenticate('github')
  // );

  app.post(
    // this should match callback url of github app
    '/api/user/signIn',(req, res) => {
      signInViaLocal(req.body.username,req.body.password).then(
        result => { res.send(result); },
        error => { res.send({ error }); }
      );
    });

  // callback route from github
  // app.get(
  //   // this should match callback url of github app
  //   '/api/user/authViaGitHub/callback',
  //   passport.authenticate('github', { failureRedirect: '/signIn/failed' }),
  //   (req, res) => { res.redirect('/'); }
  // );

  // signout the user
  // app.get('/api/user/signout', (req, res) => {
  //   req.logout();
  //   res.send('logout success');
  // });

  // get user full profile
  app.get('/api/user/profile/:username',(req, res) => {
    getFullProfile(req.params.username).then(
      result => { res.send(result); },
      error => { res.send({ error }); }
    );
  });
};

module.exports = userAPI;
