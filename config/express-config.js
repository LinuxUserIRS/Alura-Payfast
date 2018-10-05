var express = require('express');
var consign = require('consign')();
var bodyParser = require('body-parser');
var express_validator = require('express-validator');
var morgan = require('morgan');
var logger = require('../servicos/logger.js');

module.exports=function(){
    var app = express();
    app.use(morgan('common', {
        //Especificando que quero abrir uma nova thread para escrever os logs
        stream: {
            //Especificando que quero escrever um arquivo
            write: function(mensagem){
                //Recebendo a mensagem e colocando no logger
                logger.info(mensagem);
            }
        }
    }));
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    app.use(express_validator());
    consign.include('routes').then('persistencia').then('servicos').into(app);
    return app;
};

