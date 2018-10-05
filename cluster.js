var cluster=require('cluster');
var os=require('os');
var logger=require('./servicos/logger.js');

if(cluster.isMaster){
    os.cpus().forEach(function(){
        console.log("Fokando thread");
        cluster.fork();
    });
    cluster.on('listening', function(worker){
        logger.info('Thread ' + worker.process.pid +' iniciada');
    });

    cluster.on('exit', worker => {
        logger.info('Thread '+worker.process.pid+' encerrada');
        cluster.fork();
    });
}else{
    require('./index.js');
}