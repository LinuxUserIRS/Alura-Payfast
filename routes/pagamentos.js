module.exports = function(app){
    //Rota que recebe uma requisição GET para emitir um pagamento
    app.get('/pagamentos', function(req, res){
        console.log("Recebido!");
        res.send("OK");
    });

    app.put('/pagamentos/pagamento/:id', function(req, res){
        var pagamento={};
        var id = req.params.id;
        pagamento.id=id;
        pagamento.status='CONFIRMADO';
        //Criando conexão com o DB
        var DBconnection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentoDAO(DBconnection);
        pagamentoDAO.atualiza(pagamento, function(err){
            if(err){
                res.status(500).send(err);
                return;
            }
            res.send(pagamento);
            

        });

    });

    app.delete('/pagamentos/pagamento/:id', function(req, res){
        var pagamento={};
        var id = req.params.id;
        pagamento.id=id;
        pagamento.status='CANCELADO';
        //Criando conexão com o DB
        var DBconnection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentoDAO(DBconnection);
        pagamentoDAO.atualiza(pagamento, function(err){
            if(err){
                res.status(500).send(err);
                return;
            }
            res.status(204).send(pagamento);
        })
    });

    //Rota que recebe uma requisição POST para receber, validar e registrar um pagamento
    app.post('/pagamentos/pagamento', function(req, res){
        //Testando campos do JSON
        req.assert("pagamento.forma_de_pagamento", "Forma de pagamento é obrigatório").notEmpty();
        req.assert("pagamento.valor", "Preencha um valor válido").notEmpty().isFloat();
        //Se houver erros no JSON, retorna erro e loga no servidor
        if (req.validationErrors()){
            console.log("Erros na requisição");
            res.status(400).send(req.validationErrors());
            return;
        }
        var pagamento = req.body["pagamento"];
        //Setando data e status do pagamento
        pagamento.status="RECEBIDO";
        pagamento.data= new Date;
        //Criando conexão com o DB
        var DBconnection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentoDAO(DBconnection);
        //Salvando e enviando resposta
        pagamentoDAO.salva(pagamento, function(err, result){
            if (err) {
                res.status(500).json("Erro interno no servidor");
            }else{
                pagamento.id=result.insertId;
                //Informando rota onde o pagamento está localizado.
                //A rota é /pagamentos/pagamento/ID do pagamento, que é concatenado pela função result.inserId
                res.location('/pagamentos/pagamento' + pagamento.id);
                if(pagamento.forma_de_pagamento=='cartao'){
                    var cartao = req.body["cartao"];
                    return;
                }
                var response = {
                    dados_do_pagamento: pagamento,
                    //Definindo possíveis ações que podem ser tomadas a partir daqui
                    links: [
                        {
                            href: 'http://localhost:3000/pagamentos/pagamento/'+pagamento.id,
                            rel: 'CONFIRMAR',
                            method: 'PUT'
                        },
                        {
                            href: 'http://localhost:3000/pagamentos/pagamento/'+pagamento.id,
                            rel: 'CANCELAR',
                            method: 'DELETE'
                        }
                    ]
                }
                //Devolvendo código de sucesso e o JSON do pagamento
                res.status(201).json(response);

            }
        });
    });
}