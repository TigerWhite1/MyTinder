/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt');
module.exports = {

	attributes: {
		firstName: 'STRING',
		lastName: 'STRING',
		age: { type: 'INTEGER', max: 150,required: true},
		birthDate: 'DATE',
		phoneNumber: {type: 'STRING'},
		emailAddress: {type: 'email', unique: true, required: true},
		pseudo: {type: 'STRING', maxLength: 20, minLength: 5 },
		password: {
			type: 'string',
			minLength: 6,
			required: true
			// columnName: 'hashed_password'
		},
		beforeCreate: function (values, cb) {

    // Hash password
    bcrypt.hash(values.password, 10, function(err, hash) {
    	if(err) return cb(err);
    	values.password = hash;
      //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
      cb();
  });
}

}
};

