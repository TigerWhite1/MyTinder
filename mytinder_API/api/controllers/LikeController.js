/**
 * LikeController
 *
 * @description :: Server-side logic for managing Likes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {

 	like: function(req, res) {
 		console.log(req.body.userid)
 		var query = "SELECT user.pseudo, user.age, myprofil.image, myprofil.description, like.id, like.like FROM user INNER JOIN `like` ON user.id = like.userid INNER JOIN myprofil ON user.id = myprofil.userid WHERE like.like = 1 AND like.useridL ="+req.body.userid;

 		Like.query(query,function(err,data){
 			console.log(err)
 			console.log(data)
 			return res.send({
 				like : data,

 			});
 		});

 	},
 	dislike: function(req, res) {
 		console.log(req.body.userid)
 		var query = "SELECT user.pseudo, user.age, myprofil.image, myprofil.description, like.id, like.like FROM user INNER JOIN `like` ON user.id = like.userid INNER JOIN myprofil ON user.id = myprofil.userid WHERE like.like = 0 AND like.useridL ="+req.body.userid;

 		Like.query(query,function(err,data){
 			console.log(err)
 			return res.send({
 				like : data,

 			});
 		});

 	},
 	likes: function(req, res) {

 		console.log('je suis rentré likes')
 		Like.find({useridL:req.body.useridL,userid: req.body.userid}).exec(function (err, usersNamedFinn){
 			if (err) {
 				console.log('error')
 				return err;
 			}
 			console.log(usersNamedFinn)
 			if (usersNamedFinn.length === 0) {
 				console.log('create')
 				return Like.create({useridL: req.body.useridL ,userid: req.body.userid, like:req.body.like }).exec(function createCB(err, created){
 					if (err) {
 						return err;
 					}
 					return res.send({
 						like : created,

 					});
 					console.log('create like');
 				});

 			} else {

 				return Like.update({userid: req.body.userid}, {userid: req.body.userid, like: req.body.like}).where({useridL: req.body.useridL, userid: req.body.userid}).exec(function afterwards(err, updated){

 					if (err) {
 						return err;
 					}
 					console.log(updated)
 					return res.send({
 						like : updated,

 					});

 					console.log('Updated like');
 				});

 			}
 		});	

 	},
 	match: function(req, res) {
 		//SELECT user.pseudo, user.age, myprofil.image, myprofil.description,user.id FROM `like` INNER JOIN myprofil ON myprofil.userid = like.useridL INNER JOIN user ON user.id = myprofil.userid WHERE like.like = 1 AND like.userid =
 		//SELECT * FROM `like` WHERE  useridL IN (SELECT userid FROM `like` WHERE useridL = 36 AND `like` = 1) AND `like` = 1
 		// var userid = req.body.userid

 		//SELECT user.pseudo, user.age, myprofil.image, myprofil.description,user.id FROM `like` INNER JOIN myprofil ON myprofil.userid = like.useridL INNER JOIN user ON user.id = like.useridL WHERE like.useridL IN (SELECT userid FROM `like` WHERE useridL = 36 AND `like` = 1) AND like.userid IN (SELECT userid FROM `like` WHERE userid = 36 AND `like` = 1)  AND `like` = 1
 		var query = "SELECT user.pseudo, user.age, myprofil.image, myprofil.description,user.id FROM `like` INNER JOIN myprofil ON myprofil.userid = like.useridL INNER JOIN user ON user.id = like.useridL WHERE like.useridL IN (SELECT userid FROM `like` WHERE useridL = "+req.body.userid+" AND `like` = 1) AND like.userid IN (SELECT userid FROM `like` WHERE userid = "+req.body.userid+" AND `like` = 1)  AND `like` = 1";

 		Like.query(query,function(err,data){

 			console.log(err)
 			return res.send({
 				match : data,

 			});
 		});

 	},

 };

