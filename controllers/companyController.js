var helpers = require('../config/helperFunctions.js');
var companyModel = require('../models/companyModel.js');
var candyItemsModel = require('../models/candyItemsModel.js');

module.exports = function(server){
	
	server.get('/', function(req, res, next){
		helpers.success(res, next, companyCollection)
	});

	server.get('/company/:id', function(req, res, next){
		req.assert('id', 'Id is required').notEmpty();
		var errors = req.validationErrors();
		if(errors){
			helpers.failure(res, next, errors[0], 400);
		}
		if (typeof(companyCollection[req.params.id]) === 'undefined') {
			helpers.failure(res, next, 'The specified company could not be found in the database',404);
		}
		helpers.success(res, next, companyCollection[parseInt(req.params.id)]);
	});

	server.post('/candyCompany', function(req, res, next){
		req.assert('company', 'company name is required')
			.notEmpty();
		req.assert('web_address', 'Web address is required and must be either .com, .tv, or .org')
			.notEmpty()
			.isUrl()
			.contains('http://')
			.contains('.com');
		var errors = req.validationErrors();
		var company = new companyModel();
		var candyItems = new candyItemsModel();
		company.first_name = req.params.first_name;
		company.last_name = req.params.last_name;
		company.email = req.params.email;
		company.ip_address = req.params.ip_address;
		company.company = req.params.company;
		company.web_address = req.params.web_address;
		company.phone_number = req.params.phone_number;
		company.date = req.params.date;
		candyItems.company = req.params.company;
		candyItems.web_address = req.params.web_address;
		candyItems.candy_one = req.params.candy_one;
		candyItems.candy_two = req.params.candy_two;
		candyItems.candy_three = req.params.candy_three;
		company.save(function(err){
			if(err){
				helpers.failure(res, next, errors, 500);
			}
			helpers.success(res, company);
		});
		candyItems.save(function(err){
			if(err){
				helpers.failure(res, next, errors, 500);
			}
			helpers.success(res, next, candyItems);
		});
	});

	server.put('/company/:id', function(req, res, next){
		if (typeof(companyCollection[req.params.id]) === 'undefined') {
			helpers.failure(res, next, 'The specified company could not be found in the database',404);
		}
		var company = companyCollection[parseInt(req.params.id)];
		var updates = req.params;
		for (var field in updates){
			company[field] = updates[field]
		}
		helpers.success(res, next, company);
	});

	server.del('/company/:id', function(req, res, next){
		if (typeof(companyCollection[req.params.id]) === 'undefined') {
			helpers.failure(res, next, 'The specified company could not be found in the database',404);
		}
		delete companyCollection[parseInt(req.params.id)];
		helpers.success(res, next, [])
	});
}