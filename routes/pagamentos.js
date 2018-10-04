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

    app.get('/pagamentos/pagamento/:id', function(req, res){
        var id=req.params.id;
        console.log("Consultando status do pagamento: "+id);    
        var memcachedClient = app.servicos.cacheClient();
        memcachedClient.get('pagamento-'+id, function(err, result){
            console.log(result);
            if(err || !result){
                console.log("MISS - Pagamento não encontrado");
                //Criando conexão com o DB
                var DBconnection = app.persistencia.connectionFactory();
                var pagamentoDAO = new app.persistencia.PagamentoDAO(DBconnection);
                pagamentoDAO.buscaPorId(id, function(err, results){
                    if(err){
                        console.log("Erro");
                        res.status(500).send("Erro interno no servidor");
                        return;
                    }
                    res.status(201).send(results);
                })
            }else{
                console.log("HIT - Encontrado: "+result);
                res.status(201).send(result);
                return;
            }
        });
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
        pagamento.status="CRIADO";
        pagamento.data= new Date;
        //Criando conexão com o DB
        var DBconnection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentoDAO(DBconnection);
        //Salvando e enviando resposta
        pagamentoDAO.salva(pagamento, function(err, result){
            if (err) {
                res.status(500).send(err);
            }else{
                pagamento.id=result.insertId;
                var memcachedClient = app.servicos.cacheClient();
                memcachedClient.set('pagamento-' + pagamento.id, pagamento,60000, function(erro){
                  console.log('nova chave adicionada ao cache: pagamento-' + pagamento.id);
                });
                if(pagamento.forma_de_pagamento=='cartao'){
                    var cartao = req.body["cartao"];
                    var clienteCartoes = new app.servicos.clienteCartoes();
                    clienteCartoes.autoriza(cartao, function(erro, request, response, retorno){
                        if(erro){
                            console.log(erro);
                            res.status(400).send(erro);
                            return;
                        }
                        //Informando rota onde o pagamento está localizado.
                        //A rota é /pagamentos/pagamento/ID do pagamento, que é concatenado pela função result.inserId
                        res.location('/pagamentos/pagamento' + pagamento.id);
                        var response = {
                            dados_do_pagamento: pagamento,
                            cartao: cartao,
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
                        res.status(201).json(response);
                        return;
                    });
                }else{

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

            }
        });
    });
}