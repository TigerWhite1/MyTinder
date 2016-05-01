/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var passport = require('passport');

 module.exports = {

 	_config: {
 		actions: false,
 		shortcuts: false,
 		rest: false
 	},

 	login: function(req, res) {

 		passport.authenticate('local', function(err, user, info) {
 			if ((err) || (!user)) {
 				return res.send({
 					// message: info.message,
 					user: user
 				});
 			}
 			req.logIn(user, function(err) {
 				if (err) res.send(err);
 				sails.log(user.id)

 				User.find({id:user.id}).exec(function (err, usersNamedFinn){
 					if (err) {
 						return res.negotiate(err);
 					}

 					sails.log(usersNamedFinn);
 					
 					var test = {user: user, infoC: JSON.stringify(usersNamedFinn)}
 					return res.send({
 						user : user,
 						infoC: usersNamedFinn

 						// infoT: test
 					});
 				});
 				// return res.send({
 				// 	// message: info.message,
 				// 	test: test,
 				// 	toto:'totot',
 				// 	user: user
 				// });
 		});

 		})(req, res);
 	},

 	logout: function(req, res) {
 		req.logout();
 		res.redirect('/');
 	}
 };



