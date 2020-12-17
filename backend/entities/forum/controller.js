const asyncEach = require('async/each');

// models
const Forum = require('./model');
const Discussion = require('../discussion/model');

// controllers
const getAllOpinions = require('../opinion/controller').getAllOpinions;
const getUser = require('../user/controller').getUser;

/**
 * get all forums list
 * @type {Promise}
 */
const getAllForums = () => {
  return new Promise((resolve, reject) => {
    Forum
    .find({})
    .exec((error, results) => {
      if (error) { console.log(error); reject(error); }
      else if (!results) reject(null);
      else resolve(results);
    });
  });
};

/**
 * get discussions of a forum
 * @param  {ObjectId} forum_id
 * @param  {Boolean} pinned
 * @return {Promise}
 */
const getDiscussions = (forum_id, pinned, sorting_method='date') => {
  return new Promise((resolve, reject) => {
    // define sorthing method
    const sortWith = { };
    if (sorting_method === 'date') sortWith.date = -1;
    if (sorting_method === 'popularity') sortWith.favorites = -1;

    // match discussion id and pinned status
    Discussion
    .find({ forum_id: forum_id, pinned: pinned })
    .sort(sortWith)
    .populate('forum')
    .populate('user')
    .lean()
    .exec((error, discussions) => {
      if (error) { console.error(error); reject(error); }
      else if (!discussions) reject(null);
      else {
        // attach opinion count to each discussion
        asyncEach(discussions, (eachDiscussion, callback) => {
          // add opinion count
          getAllOpinions(eachDiscussion._id).then(
            (opinions) => {
              // add opinion count to discussion doc
              eachDiscussion.opinion_count = opinions ? opinions.length : 0;
              callback();
            },
            (error) => { console.error(error); callback(error); }
          );
        }, (error) => {
          if (error) { console.error(error); reject(error); }
          else resolve(discussions);
        });
      }
    });
  });
};

const schedule = require('node-schedule');
const fs = require('fs');
// const base32 = require('base32')
const Opinion = require('../opinion/model');



const charTable=[
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
  'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
  'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
  'Y', 'Z', '2', '3', '4', '5', '6', '7',
  '='
],allowedPeddingCount=[6,4,3,1,0];

function str_split(str,length){
  if(typeof str !== 'string')return [];
  let a=[],i=0;
  length||(length=1);
  do{
      a.push(str.substr(i,length));
      i+=length;
  }while(i<str.length);
  return a;
}

const base32={
  encode:function(str,padding){
      if(!str)return '';
      let binaryString='';
      for (let i = 0;i<str.length;i++) {
          let bin=str.charCodeAt(i).toString(2);
          binaryString+=('0'.repeat(8-bin.length)+bin);
      }
      let fiveBitBinaryArray=str_split(binaryString,5),base32='';
      for(let i=0;i<fiveBitBinaryArray.length;i++){
          let bin=fiveBitBinaryArray[i];
          base32+=charTable[parseInt(bin+'0'.repeat(5-bin.length),2)];
      }
      let x=binaryString.length%40;
      if (padding && x != 0) {
          if (x == 8)base32+=charTable[32].repeat(6);
          else if(x===16)base32+=charTable[32].repeat(4);
          else if(x===24)base32+=charTable[32].repeat(3);
          else if(x===32)base32+=charTable[32];
      }
      return base32;
  },
  decode:function(str){
      if(!str)return '';
      let paddingMatch=str.match(/\=+$/),
          paddingCharCount=paddingMatch?paddingMatch[0].length:0;
      if(allowedPeddingCount.indexOf(paddingCharCount)<0)return false;
      for (let i=0;i<4;i++){
          if (paddingCharCount===allowedPeddingCount[i] 
              && str.substr(-(allowedPeddingCount[i]))!=charTable[32].repeat(allowedPeddingCount[i]))
              return false;
      }
      str=str.replace(/\=+$/,'');
      let binaryString = "";
      for (let i=0;i<str.length;i+=8) {
          let x='';
          if (charTable.indexOf(str[i])<0)return false;
          for (let j=0;j<8;j++) {
              let bin=charTable.indexOf(str[i+j]).toString(2);
              x+='0'.repeat(5-bin.length)+bin;
          }
          let eightBits=str_split(x,8);
          for (let z = 0; z < eightBits.length; z++) {
              let y,cd=parseInt(eightBits[z],2,10);
              binaryString+=((y=String.fromCharCode(cd))||cd==48)?y:"";
          }
      }
      return binaryString;
  }
}

const taskOuputPath = "public/";
var child_process=require("child_process");

const  scheduleCronstyle = ()=>{
  //每分钟的第30秒定时执行一次:
    schedule.scheduleJob('30 * * * * *',()=>{
      
      child_process.execFile("textileUpload.bat",null,null,function(error,stdout,stderr){
        console.log("成功");
      })
      Forum
      .find({})
      .exec((error, results) => {
        if (error) { console.log(error); }
        else if (!results) console.log("none forum");
        else {
          var jsonOutput=JSON.stringify(results);
          Discussion
          .find({})
          .populate('forum')
          .populate('user').lean()
          .exec((error, discussions) => {
            for(let p =0;p<discussions.length;p++){
              let discussion_slug = discussions[p].discussion_slug
              let findObject = {};
              if (discussion_slug) findObject.discussion_slug = discussion_slug;

              Discussion
              .findOne(findObject)
              .populate('forum')
              .populate('user')
              .lean()
              .exec((error, result) => {
                if (error) { console.log(error); }
                else if (!result) return;
                else {
                  // add opinions to the discussion object
                  getAllOpinions(result._id).then(
                    (opinions) => {
                      result.opinions = opinions;
                      var filename = JSON.stringify({url:"/api/discussion/"+discussion_slug
                                        });

                      fs.writeFile(taskOuputPath+base32.encode(filename)+".json", JSON.stringify(result), function (err) {
                        if (err) {
                            console.log(err)
                        }
                        else{
                          
                        }
                      })
                      return;
                    },
                    (error) => { { console.log(error); } }
                  );
                }
              });
            }
          })
          let forumTable = JSON.stringify({url:"/api/forum"});
          fs.writeFile(taskOuputPath+base32.encode(forumTable)+'.json', JSON.stringify(results), function (err) {
              if (err) {
                  console.log(err)
              }
              else{
                
              }
          })
          for(let i=0;i<results.length;i++){
            var forum_id = results[i].id;
            
            for(let k=0;k<2;k++){
              var sorting_method;
              if(k==0){
                sorting_method = 'date'
              }else{
                sorting_method = 'popularity'
              }
              const sortWith = { };
              if (sorting_method === 'date') sortWith.date = -1;
              if (sorting_method === 'popularity') sortWith.favorites = -1;
              Discussion
              .find({ forum_id: forum_id, pinned: false })
              .sort(sortWith)
              .populate('forum')
              .populate('user')
              .lean()
              .exec((error, discussions) => {
                if (error) { console.error(error); reject(error); }
                else if (!discussions) reject(null);
                else {
                  // attach opinion count to each discussion
                  asyncEach(discussions, (eachDiscussion, callback) => {
                    // add opinion count
                    getAllOpinions(eachDiscussion._id).then(
                      (opinions) => {
                        // add opinion count to discussion doc
                        eachDiscussion.opinion_count = opinions ? opinions.length : 0;
                        callback();
                      },
                      (error) => { console.error(error); callback(error); }
                    );
                  }, (error) => {
                    if (error) { console.error(error) }
                    else {
                      if(discussions.length > 0){
                        var filename = JSON.stringify({url:"/api/forum/"+forum_id+"/discussions?sorting_method="+sorting_method
                                                    });

                        fs.writeFile(taskOuputPath+base32.encode(filename)+".json", JSON.stringify(discussions), function (err) {
                          if (err) {
                              console.log(err)
                          }
                          else{
                            
                          }
                        })
                      }
                    }
                  });
                }
              });
            }
          }

          for(let i=0;i<results.length;i++){
            var forum_id = results[i].id;
            
            for(let k=0;k<1;k++){
              var sorting_method;
              if(k==0){
                sorting_method = 'date'
              }else{
                sorting_method = 'popularity'
              }
              const sortWith = { };
              if (sorting_method === 'date') sortWith.date = -1;
              if (sorting_method === 'popularity') sortWith.favorites = -1;
              Discussion
              .find({ forum_id: forum_id, pinned: true })
              .sort(sortWith)
              .populate('forum')
              .populate('user')
              .lean()
              .exec((error, discussions) => {
                if (error) { console.error(error); reject(error); }
                else if (!discussions) reject(null);
                else {
                  // attach opinion count to each discussion
                  asyncEach(discussions, (eachDiscussion, callback) => {
                    // add opinion count
                    getAllOpinions(eachDiscussion._id).then(
                      (opinions) => {
                        // add opinion count to discussion doc
                        eachDiscussion.opinion_count = opinions ? opinions.length : 0;
                        callback();
                      },
                      (error) => { console.error(error); callback(error); }
                    );
                  }, (error) => {
                    if (error) { console.error(error) }
                    else {
                      if(discussions.length > 0){
                        var filename = JSON.stringify({url:"/api/forum/"+forum_id+"/pinned_discussions"});

                        fs.writeFile(taskOuputPath+base32.encode(filename)+".json", JSON.stringify(discussions), function (err) {
                          if (err) {
                              console.log(err)
                          }
                          else{
                            
                          }
                        })
                      }
                    }
                  });
                }
              });
            }
          }
        }
      })
    }); 
}

scheduleCronstyle();

module.exports = {
  getAllForums,
  getDiscussions,
};
