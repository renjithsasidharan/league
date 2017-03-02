const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
const  winston = require('winston');
winston.emitErrs = true;
const logDir = 'logs';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toLocaleTimeString();

const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      timestamp: tsFormat,
      level: env === 'development' ? 'debug' : 'info',
      filename: 'logs/log.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.Console({
      timestamp: tsFormat,
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

module.exports = logger;
module.exports.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};
