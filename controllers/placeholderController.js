var helpers = require('../config/helperFunctions.js');

//placeholder collection
var placeholderCollection = {};
var max_id = 0;

module.exports = function(server){
	
	server.get('/', function(req, res, next){
		helpers.success(res, next, placeholderCollection)
	});

	server.get('/placeholder/:id', function(req, res, next){
		req.assert('id', 'Id is required').notEmpty();
		var errors = req.validationErrors();
		if(errors){
			helpers.failure(res, next, errors[0], 400);
		}
		if (typeof(placeholderCollection[req.params.id]) === 'undefined') {
			helpers.failure(res, next, 'The specified placeholder could not be found in the database',404);
		}
		helpers.success(res, next, placeholderCollection[parseInt(req.params.id)]);
	});

	server.post('/placeholder', function(req, res, next){
		req.assert('first_name', 'First Name is required').notEmpty().isAlpha();
		req.assert('last_name', 'Last Name is required').notEmpty().isAlpha();
		req.assert('company', 'Company name is required').notEmpty();
		req.assert('web_address', 'Web address is required and must be either .com, .tv, or .org').notEmpty().isUrl().contains('http://').contains('.com');
		req.assert('candy_four', 'Candy Item 4 is required').notEmpty();
		var errors = req.validationErrors();
		if(errors){
			helpers.failure(res, next, errors[0], 400);
		}
		var placeholder = req.params;
		max_id++;
		placeholder.id = max_id;
		placeholderCollection[placeholder.id] = placeholder;
		helpers.success(res, next, placeholder)
	});

	server.put('/placeholder/:id', function(req, res, next){
		if (typeof(placeholderCollection[req.params.id]) === 'undefined') {
			helpers.failure(res, next, 'The specified placeholder could not be found in the database',404);
		}
		var placeholder = placeholderCollection[parseInt(req.params.id)];
		var updates = req.params;
		for (var field in updates){
			placeholder[field] = updates[field]
		}
		helpers.success(res, next, placeholder);
	});

	server.del('/placeholder/:id', function(req, res, next){
		if (typeof(placeholderCollection[req.params.id]) === 'undefined') {
			helpers.failure(res, next, 'The specified placeholder could not be found in the database',404);
		}
		delete placeholderCollection[parseInt(req.params.id)];
		helpers.success(res, next, [])
	});
}