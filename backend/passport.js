/**
 * module dependencies for passport configuration
 */
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const LocalStrategy = require('passport-local').Strategy;

const GITHUB_CLIENT_ID = require('../config/credentials').GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = require('../config/credentials').GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = require('../config/credentials').GITHUB_CALLBACK_URL;

// controllers
const getUser = require('./entities/user/controller').getUser;
const signInViaGithub = require('./entities/user/controller').signInViaGithub;
const signInViaLocal = require('./entities/user/controller').signInViaLocal;
const findUser = require('./entities/user/controller').findUser;

var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'tasmanianDevil';



/**
 * passport configuration
 */
const passportConfig = (app) => {
  


  var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, done) {
    console.log(jwt_payload);
    findUser(jwt_payload.id).then(
      (user) => { console.log('got the user'); done(null, user); },
      (error) => { console.log('something error occurs'); done(error); }
    )
  });

  // passport.serializeUser((user, done) => {
  //   done(null, user._id);
  // });

  // passport.deserializeUser((id, done) => {
  //   getUser(id).then(
  //     (user) => { done(null, user); },
  //     (error) => { done(error); }
  //   );
  // });
  
  passport.use('jwt',strategy);
  // passport.use('local',new LocalStrategy(function (username,password,done){
  //   signInViaLocal(username,password).then(
  //     (user) => { console.log('got the user'); done(null, user); },
  //     (error) => { console.log('something error occurs'); done(error); }
  //   )
  // }));
    
  // github strategy for passport using OAuth
  // passport.use(new GitHubStrategy(
  //   {
  //     clientID: GITHUB_CLIENT_ID,
  //     clientSecret: GITHUB_CLIENT_SECRET,
  //     callbackURL: GITHUB_CALLBACK_URL,
  //     scope: 'user:email',
  //   },
  //   (accessToken, refreshToken, gitProfile, done) => {
  //     signInViaGithub(gitProfile).then(
  //       (user) => { console.log('got the user'); done(null, user); },
  //       (error) => { console.log('something error occurs'); done(error); }
  //     );
  //   }
  // ));
};

module.exports = passportConfig;
