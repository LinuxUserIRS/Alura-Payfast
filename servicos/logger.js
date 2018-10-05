var winston = require('winston');


module.exports = winston.createLogger({
    transports: [
        new winston.transports.File({
            level: "info",
            filename: "./logs/payfast.log",
            maxsize: 10000,
            maxFiles: 2
        })
    ]
});

