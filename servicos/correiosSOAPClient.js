var soap = require('soap');

function CorreiosSOAPClient(){
    this._url='http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
}
module.exports=function(){
    return CorreiosSOAPClient;
}
CorreiosSOAPClient.prototype.calculaPrazo=function(args, callback){
    soap.createClient(this._url, function(err, cliente){
        if(err){
            console.log(err);
            return;
        }    
        console.log("SOAP criado");
        cliente.CalcPrazo(args, callback);
    });

}