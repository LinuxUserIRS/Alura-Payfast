var express = require('express');
var consign = require('consign')();
var bodyParser = require('body-parser');
var express_validator = require('express-validator');

module.exports=function(){
    var app = express();
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    app.use(express_validator());
    consign.include('routes').then('persistencia').then('servicos').into(app);
    return app;
};

