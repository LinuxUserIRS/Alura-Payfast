var fs=require('fs');

fs.createReadStream('teste.txt').pipe(fs.createWriteStream('teste3.txt')).on('finish', function(){
    console.log("Terminado!")
});