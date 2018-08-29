module.exports = function(app){
    app.get('/pagamentos', function(req, res){
        console.log("Recebido!");
        res.send("OK");
    });

    app.post('/pagamentos/pagamento', function(req, res){
        req.assert("forma_de_pagamento", "Forma de pagamento é obrigatório").notEmpty();
        req.assert("valor", "Preencha um valor válido").notEmpty().isFloat();
        if (req.validationErrors()){
            console.log("Erros na requisição");
            res.status(400).send(req.validationErrors());
            return;
        }
        var pagamento = req.body;
        pagamento.status="recebido";
        pagamento.data= new Date;
        var DBconnection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentoDAO(DBconnection);
        pagamentoDAO.salva(pagamento, function(err, result){
            if(err) res.send(err);
            res.json("Recebi seu pagamento");
        });
    });
}