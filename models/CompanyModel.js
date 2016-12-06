var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var companySchema = new Schema({
	id	:	ObjectId,
	first_name	:	String,
	last_name	:	String,
	email	:	String,
	ip_address	:	String,
	company	:	String,
	web_address	: String,
	phone_number	:	String,
	date	:	Date
});
companySchema.index({first_name:-1, last_name:-1, email: -1, ip_address: -1, company:1, web_address:1, phone_number:-1, date:-1});

var companyModel = mongoose.model('company', companySchema);

module.exports = companyModel;
