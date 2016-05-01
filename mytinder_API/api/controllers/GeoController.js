/**
 * GeoController
 *
 * @description :: Server-side logic for managing geos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {
 	geosearch: function(req, res) {

 		Geo.find({userid:req.body.userid}).exec(function (err, geo){

 			var query = "SELECT user.pseudo, user.age,myprofil.userid, myprofil.image, myprofil.description FROM myprofil INNER JOIN user ON user.id = myprofil.userid WHERE myprofil.userid IN (SELECT userid FROM geo WHERE get_distance_metres('"+geo[0].lat+"', '"+geo[0].lng+"', lat, lng) < "+req.body.dist+") AND myprofil.userid !="+req.body.userid;

 			Messenger.query(query,function(err,data){

 				console.log(err)
 				return res.send({
 					profil : data,

 				});
 			});
 		})

 	},
 	geoInsert: function(req, res) {
 		console.log(req.body.userid)

 		console.log('je suis rentré')
 		Geo.find({userid:req.body.userid}).exec(function (err, usersNamedFinn){
 			if (err) {
 				console.log('error')
 				return err;
 			}
 			console.log(usersNamedFinn)
 			if (usersNamedFinn.length === 0) {
 				console.log('create')
 				return Geo.create({userid: req.body.userid, lat: req.body.lat, lng: req.body.lng }).exec(function createCB(err, created){
 					if (err) {
 						return err;
 					}
 					return res.send({
 						geo : created,

 					});
 				});

 			} else {
 				console.log('update')
 				return Geo.update({userid: req.body.userid}, {lat: req.body.lat, lng: req.body.lng}).where({userid: req.body.userid}).exec(function afterwards(err, updated){

 					if (err) {
 						return err;
 					}
 					return res.send({
 						geo : updated,

 					});
 				});

 			}
 		});	

 	},

 };

