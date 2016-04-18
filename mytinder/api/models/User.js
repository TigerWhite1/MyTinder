/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	firstName: 'STRING',
  	lastName: 'STRING',
  	age: { type: 'INTEGER'},
  	birthDate: 'DATE',
  	phoneNumber: {type: 'STRING'},
  	emailAddress: {type: 'STRING'},
	pseudo: {type: 'STRING'}

  }
};

