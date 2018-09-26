var restify = require('restify');

var cliente = restify.createJsonClient({
    http: 'http://localhost:3001'
});
cliente.post('/cartoes/autoriza', function(err, req, res, retorno){
   console.log('Consumindo serviço de cartões.');
   console.log(retorno); 
});