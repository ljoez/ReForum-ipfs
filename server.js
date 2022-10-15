// modules for server
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');


// server configurations
const serverConfigs = require('./config/serverConfig');

// connect to database
mongoose.connect(serverConfigs.DBURL);
// initialize express
const app = express();
app.all('*', function(req, res, next) {
       res.header("Access-Control-Allow-Origin", '*'); //需要显示设置来源
       res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Access-Token,authorization ");
       res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
     next();
   });
  
require('./backend/express')(app, serverConfigs);
// app.use(cors());
// require("./backend/enable-cors.js")(app);
// fire up the server
app.listen(serverConfigs.PORT, (error) => {
  if (error) throw error;
  console.log('Server running on port: ' + serverConfigs.PORT);
});
