var cache = require('memcached');

module.exports = function(){
    //Sem parenteses!!!!
    return createMemcachedClient;
}

function createMemcachedClient(){
    var cliente = new cache('localhost:11211',{
        //Número de tentativas
        retries: 5,
        //Tempo entre uma tentativa e outra
        retry: 1000,
        //Removendo nós mortos
        remove: true
    });
    return cliente;
}

