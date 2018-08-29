module.exports = function(app){
    app.get('/pagamentos', function(req, res){
        console.log("Recebido!");
        res.send("OK");
    });

    app.post('/pagamentos/pagamento', function(req, res){
        //Testando campos do JSON
        req.assert("forma_de_pagamento", "Forma de pagamento é obrigatório").notEmpty();
        req.assert("valor", "Preencha um valor válido").notEmpty().isFloat();
        //Se houver erros no JSON, retorna erro e loga no servidor
        if (req.validationErrors()){
            console.log("Erros na requisição");
            res.status(400).send(req.validationErrors());
            return;
        }
        var pagamento = req.body;
        //Setando data e status do pagamento
        pagamento.status="recebido";
        pagamento.data= new Date;
        //Criando conexão com o DB
        var DBconnection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentoDAO(DBconnection);
        //Salvando e enviando resposta
        pagamentoDAO.salva(pagamento, function(err, result){
            if (err) {
                res.status(500).json("Erro interno no servidor");
            }else{
                res.location('/pagamentos/pagamento' + result.insertId);
                res.status(201).json(pagamento);

            }
        });
    });
}