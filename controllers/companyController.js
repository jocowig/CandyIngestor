var helpers = require('../config/helperFunctions.js');
var companyModel = require('../models/companyModel.js');
var candyItemsModel = require('../models/candyItemsModel.js');
var valFile = "./ValidationErrors.txt";
var dupFile = "./DuplicationErrors.txt";

module.exports = function(server, fs){

	server.get('/company', function(req, res, next){
		companyModel.find({}, function(err, company){
			if (err){
				helpers.failure(res, next, 'Something went wrong fetching company from database');
			}
			if (company === null){
				helpers.failure(res, next, 'The specified company could not be found', 404);
			}
			helpers.success(res, next, company);
		});
	});
	
	server.get('/company/:id', function(req, res, next){
		req.assert('id', 'Id is required').notEmpty();
		var errors = req.validationErrors();
		if(!errors){
			companyModel.findOne({ _id: req.params.id}, function(err, company){
				if (err){
					helpers.failure(res, next, 'Something went wrong fetching company from database');
				}
				if (company === null){
					helpers.failure(res, next, 'The specified company could not be found', 404);
				}
				helpers.success(res, next, company);
			});
		}
	});

	server.post('/company', function(req, res, next){
		checkForErrors(req, res, next);
		checkForDuplicates(req, res, next);
		
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
		
		candyItems.save(function(err){
			if(err){
				helpers.failure(res, next, err, 500);
			}
			helpers.success(res, candyItems);
		});
		
		company.save(function(err){
			if(err){
				helpers.failure(res, next, err, 500);
			}
			helpers.success(res, next, company);
		});
	});
	
	checkForDuplicates = function(req, res, next){
		error = "";
		if(req.params.company == ""){
			companyModel.find({web_address: req.params.web_address, last_name: req.params.last_name}, function(err, companyData){
				if(companyData.length > 0){
					companyData.forEach(function(match){
						if(match.first_name == req.params.first_name){
							writeErrorsToFiles(dupFile, "Duplicate, web_address, first and last names match, and company is null \n", req.params);
							error = "Duplicate, web_address, first and last names match, and company is null";
							helpers.failure(res, next, error, 500);
						}
						if(match.first_name[0] == req.params.first_name[0]){
							writeErrorsToFiles(dupFile, "Questionable, web_address, and last names match, company is null, and first initial of first name matches \n", req.params);
							error = "Questionable, web_address, and last names match, company is null, and first initial of first name matches";
							helpers.failure(res, next, error, 500);
						}
					});
					
				}
			});
		}
		companyModel.find({web_address: req.params.web_address, company: req.params.company}, function(err, companyData){
			if(companyData.length > 0){
				writeErrorsToFiles(dupFile, "Duplicate, web_address and company name match with existing records", req.params);
				error = "Duplicate, web_address and company name match with existing records";
				helpers.failure(res, next, error, 500);
			}
		});
		return "";
	}
	
	checkForErrors = function(req, res, next){
		if(req.params.web_address == ""){
			writeErrorsToFiles(valFile, "Web address is required \n" + req.params);
			helpers.failure(res, next, "Web address is required", 400);
		}
		if(req.params.web_address.indexOf("http://") < 0){
			writeErrorsToFiles(valFile, "Web address must contain http:// \n", req.params);
			helpers.failure(res, next, "Web address must contain http://", 400);
		}
		var dotComDotTvOrDotOrg = (req.params.web_address.indexOf(".com") >=0 || req.params.web_address.indexOf(".tv") >=0 || req.params.web_address.indexOf(".org") >= 0);
		if(!dotComDotTvOrDotOrg){
			writeErrorsToFiles(valFile, "Web address must contain .com, .tv, or .org", req.params);
			helpers.failure(res, next, "Web address must contain .com, .tv, or .org \n", 400);
		}
		if(req.params.company == ""){
			console.log(req.params.toString());
			writeErrorsToFiles(valFile, "Company name is required \n", req.params);
			helpers.failure(res, next, "Company name is required" , 400);
		}
	}
	
	writeErrorsToFiles = function(file, error, data)
		{
			fs.open(file, 'a', 666, function( e, id ) {
				fs.write( id,"\r\n" + error + ":\r\n", null, 'utf8')
				for(param in data){
					fs.write( id, param + " : " + data[param] + "\r\n", null, 'utf8')
				}
				fs.close();
			});
		}	
				
	server.put('/company/:id', function(req, res, next){
		req.assert('id', 'Id is required').notEmpty();
		var errors = req.validationErrors();
		if(errors){
			helpers.failure(res, next, errors, 400);
		}
		companyModel.findOne({ _id: req.params.id}, function(err, company){
			if (err){
				helpers.failure(res, next, 'Something went wrong fetching company from database');
			}
			if (company === null){
				helpers.failure(res, next, 'The specified company could not be found', 404);
			}
			var updates = req.params;
			delete updates.id;
			for(var field in updates){
				company[field] = updates[field]
			}
			company.save(function(err){
				helpers.failure(res, next, 'Error updating company', 500);
			});
			helpers.success(res, next, company);
		});
	});

	server.del('/company/:id', function(req, res, next){
		req.assert('id', 'Id is required').notEmpty();
		var errors = req.validationErrors();
		if(errors){
			helpers.failure(res, next, errors, 400);
		}
		companyModel.findOne({ _id: req.params.id}, function(err, company){
			if (err){
				helpers.failure(res, next, 'Something went wrong fetching company from database');
			}
			if (company === null){
				helpers.failure(res, next, 'The specified company could not be found', 404);
			}
			company.remove(function(err){
				helpers.failure(res, next, 'Error deleting company', 500);
			});
			helpers.success(res, next, company);
		});
	});
}