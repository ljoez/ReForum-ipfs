const schedule = require('node-schedule');
const fs = require('fs');
// const base32 = require('base32')
const Opinion = require('./entities/opinion/model');
const asyncEach = require('async/each');

// models
const Forum = require('./entities/forum/model');
const Discussion = require('./entities/discussion/model');

// controllers
const getAllOpinions = require('./entities/opinion/controller').getAllOpinions;
const getUser = require('./entities/user/controller').getUser;
const keccak256 = require('keccak256');


const taskOuputPath = "json/";

const scheduleCronstyle = async ()=>{
    schedule.scheduleJob('30 * * * * *',async ()=>{
      
      await new Promise((resolveThird,rejectThird)=>{
        Forum
        .find({})
        .exec(async (error, results) => {
          if (error) { console.log(error); }
          else if (!results) console.log("none forum");
          else {
            var jsonOutput=JSON.stringify(results);
            await new Promise((resolveSecond,rejectSecond)=>{
              Discussion
              .find({})
              .populate('forum')
              .populate('user').lean()
              .exec(async (error, discussions) => {
                for(let p =0;p<discussions.length;p++){
                  let discussion_slug = discussions[p].discussion_slug
                  let findObject = {};
                  if (discussion_slug) findObject.discussion_slug = discussion_slug;
                  
                  await new Promise((resolve,reject)=>{
                    Discussion
                    .findOne(findObject)
                    .populate('forum')
                    .populate('user')
                    .lean()
                    .exec(async(error, result) => {
                      if (error) { console.log(error); reject(0);}
                      else if (!result) reject(0);
                      else {
                        // add opinions to the discussion object
                        getAllOpinions(result._id).then(
                          (opinions) => {
                            result.opinions = opinions;
                            var filename = JSON.stringify({url:"/api/discussion/"+discussion_slug
                                              });

                            fs.writeFile(taskOuputPath+keccak256(filename).toString('hex')+".json", JSON.stringify(result), function (err) {
                              if (err) {
                                  console.log(err);
                                  reject(0);
                              }
                              else{
                                resolve(1);
                              }
                            })
                            return;
                          },
                          (error) => { { console.log(error);reject(0); } }
                        );
                      }
                    });
                  });
                }
                resolveSecond(1);
              })
            });
            let forumTable = JSON.stringify({url:"/api/forum"});
            
            await new Promise((resolveSecond,rejectSecond)=>{
              fs.writeFile(taskOuputPath+keccak256(forumTable).toString('hex')+'.json', JSON.stringify(results), function (err) {
                  if (err) {
                      console.log(err);
                      rejectSecond(0);
                  }
                  else{
                    resolveSecond(1);
                  }
              })
            });
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
                
                await new Promise((resolveCount,rejectCount)=>{
                  Discussion.find({ forum_id: forum_id, pinned: false }).count(async (errCount,resultCount)=>{
                    var pageArray = [];
                    for(let p=0;p<=resultCount/10;p++){
                      await new Promise((resolve,reject)=>{
                        Discussion
                        .find({ forum_id: forum_id, pinned: false })
                        .sort(sortWith)
                        .skip(10*p)
                        .limit(10)
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
                                  var filename = JSON.stringify({url:"/api/forum/"+forum_id+"/discussions?sorting_method="+sorting_method+"&pageNum="+(p+1)
                                                              });
      
                                  fs.writeFile(taskOuputPath+keccak256(filename).toString('hex')+".json", JSON.stringify(discussions), function (err) {
                                    if (err) {
                                      console.log(err)
                                      reject(0);
                                    }
                                    else{
                                      resolve(1);
                                    }
                                  })
                                }
                              }
                            });
                          }
                        });
                      });

                    }
                    resolveCount(1);
                  });
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
                await new Promise((resolve,reject)=>{
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
                            var filename = JSON.stringify({url:"/api/forum/"+discussions[0].forum_id+"/pinned_discussions"});

                            fs.writeFile(taskOuputPath+keccak256(filename).toString('hex')+".json", JSON.stringify(discussions), function (err) {
                              if (err) {
                                  console.log(err)
                                  reject(0);
                              }
                              else{
                                resolve(1);
                              }
                            })
                          }
                        }
                      });
                    }
                  });
                });
              }
            }
          }
          resolveThird(1);
        })
      
      });
    }); 
}


module.exports = scheduleCronstyle;