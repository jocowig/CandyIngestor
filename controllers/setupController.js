module.exports = function(server, restify){
	
	server.use(restify.acceptParser(server.acceptable));
	server.use(restify.bodyParser());
	server.use(restify.queryParser());

}