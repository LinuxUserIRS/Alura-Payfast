module.exports=function(app){
    app.post('/correios/calculo-prazo', function(req, res){
        var dadosEntrega = req.body;
        var correiosSOAPClient = new app.servicos.correiosSOAPClient();
        correiosSOAPClient.calculaPrazo(dadosEntrega, function(erro, result){
            if(erro){
                res.status(500).send(erro);
                return;
            }
            res.json(result);
        });
    });
};