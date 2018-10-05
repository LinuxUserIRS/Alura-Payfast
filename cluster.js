var cluster=require('cluster');
var os=require('os');

if(cluster.isMaster){
    os.cpus().forEach(function(){
        console.log("Fokando thread");
        cluster.fork();
    });
}else{
    require('./index.js');
}