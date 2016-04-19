/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
 var bcrypt = require('bcrypt');
 module.exports = {

 	attributes: {
 		age: { type: 'STRING', max: 100,required: true},
 		email: {type: 'email', unique: true, required: true},
 		pseudo: {type: 'STRING', maxLength: 20, minLength: 5,required: true},
 		sexe: { type: 'STRING', max: 3,required: true},
 		password: {
 			type: 'string',
 			minLength: 6,
 			required: true
 		}
 	},
 	beforeCreate: function (values, cb) {

 		bcrypt.hash(values.password, 10, function(err, hash) {
 			if(err) return cb(err);
 			values.password = hash;
 			cb();
 		});
 	}

 };

