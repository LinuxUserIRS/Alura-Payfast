var fs=require('fs');
module.exports=function(app){
    app.post('/upload/imagem', function(req, res){
        var filename=req.headers.filename;
        req.pipe(fs.createWriteStream('files/'+filename+'.jpg')).on('finish', function(){
            res.status(201).send("Imagem receida!");
        });
    });
}