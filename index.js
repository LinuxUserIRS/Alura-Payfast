var app = require('./config/express-config')();

app.listen(3000, 'localhost', function(){
    console.log("Servidor rodando!");
});

