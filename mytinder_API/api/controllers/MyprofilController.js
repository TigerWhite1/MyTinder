/**
 * MyprofilController
 *
 * @description :: Server-side logic for managing Myprofils
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 module.exports = {

 	myprofil: function(req, res) {
 		console.log(req.body.userid)

 		console.log('je suis rentré')
 		Myprofil.find({userid:req.body.userid}).exec(function (err, usersNamedFinn){
 			if (err) {
 				console.log('error')
 				return err;
 			}
 			console.log(usersNamedFinn)
 			if (usersNamedFinn.length === 0) {
 				console.log('create')
 				return Myprofil.create({userid: req.body.userid, description: req.body.description, image: req.body.image }).exec(function createCB(err, created){
 					if (err) {
 						return err;
 					}
 					console.log('Created user with name ');
 				});

 			} else {
 				console.log('update')
 				return Myprofil.update({userid: req.body.userid}, {description: req.body.description, image: req.body.image}).where({userid: req.body.userid}).exec(function afterwards(err, updated){

 					if (err) {
 						return err;
 					}

 					console.log('Updated user to have name ');
 				});

 			}
 		});	

 	},
 	profil : function(req, res) {
 		var query = "SELECT user.pseudo, user.age,myprofil.userid, myprofil.image, myprofil.description FROM user INNER JOIN myprofil ON user.id = myprofil.userid WHERE user.id !="+req.body.userid;

 		Myprofil.query(query,function(err,data){
 			console.log(err)
 			return res.send({
 				profil : data,

 			});
 		});
 	}

 }

// };

