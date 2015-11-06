var winston = require('winston'),
    transports  = [];


// var logger = new (winston.Logger)({
//   transports: [
//     // new (winston.transports.Console)({ 
//     //     level: 'info',
//     //     colorize: true
//     //   })
//     // ,
//     new winston.transports.DailyRotateFile({
//         name: 'file',
//         datePattern: '.yyyy-MM-dd',
//         filename: './logs/log_file.log',
//         level: 'debug',
//         handleExceptions: true,
//         humanReadableUnhandledException: true
//       })
//   ]
// });
// console.log(winston.transports);
var daily = new winston.transports.File({
  name: 'file',
  datePattern: '.yyyy-MM-dd', 
  filename: __dirname + '/logs/log_file.log',
});

transports.push(daily);

var logger = new winston.Logger({transports: transports});

logger.exitOnError = true;
logger.level = 'debug';

module.exports = logger;
