/**
 * MessengerController
 *
 * @description :: Server-side logic for managing messengers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {

 	history: function(req, res) {
 		//SELECT user.pseudo, user.age, myprofil.image, myprofil.description,user.id FROM `like` INNER JOIN myprofil ON myprofil.userid = like.useridL INNER JOIN user ON user.id = myprofil.userid WHERE like.like = 1 AND like.userid =
 		//SELECT * FROM `like` WHERE  useridL IN (SELECT userid FROM `like` WHERE useridL = 36 AND `like` = 1) AND `like` = 1
 		// var userid = req.body.userid
 		"+req.body.useridS+"
 		var query = "SELECT * FROM `messenger` WHERE `useridS` = "+req.body.useridS+" AND `useridR` = "+req.body.useridR+" || `useridS` = "+req.body.useridR+" AND `useridR` = "+req.body.useridS+" ORDER BY createdAt ASC";

 		Messenger.query(query,function(err,data){

 			console.log(err)
 			return res.send({
 				history : data,

 			});
 		});

 	},

 };

