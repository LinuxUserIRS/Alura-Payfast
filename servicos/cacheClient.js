var cache = require('memcached');

var cliente = new cache('localhost:11211',{
    //Número de tentativas
    retries: 5,
    //Tempo entre uma tentativa e outra
    retry: 1000,
    //Removendo nós mortos
    remove: true
});
cliente.set('pagamento-2', {
    "pagamento":{
      "forma_de_pagamento":"payfast",
      "valor":98.53 ,
      "moeda":"USD",
      "descricao":"criando um pagamento"
    }
  }, 10000, function(err){
      console.log('Adicionado');
  });
cliente.get('pagamento-2', function(err, result){
    if(err || !result){
        console.log("MISS - Pagamento não encontrado");
    }else{
        console.log("HIT - Encontrado: "+result);
    }
});