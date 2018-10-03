var fs=require('fs');
fs.readFile('teste.txt', function(error, buffer){
    console.warn("Lido!");
    fs.writeFile('teste2.txt', buffer, function(){
        console.error("Escrito");
    })
});