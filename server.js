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
  
// app.all("*",function(req,res,next){
//   //设置允许跨域的域名，*代表允许任意域名跨域
//   res.header("Access-Control-Allow-Origin","http://testwx.ouhaibank.com:8080");
//   //允许的header类型
//   res.header("Access-Control-Allow-Headers","content-type");
//   res.header("Access-Control-Allow-Credentials", true);
//   //跨域允许的请求方式 
//   res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
//   if (req.method.toLowerCase() == 'options')
//       res.send(200);  //让options尝试请求快速结束
//   else
//       next();
// })
// apply express configs
require('./backend/express')(app, serverConfigs);
// app.use(cors());
// require("./backend/enable-cors.js")(app);
// fire up the server
app.listen(serverConfigs.PORT, (error) => {
  if (error) throw error;
  console.log('Server running on port: ' + serverConfigs.PORT);
});
