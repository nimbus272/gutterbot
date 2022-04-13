const winston = require("winston");
module.exports = {

  logger: winston.createLogger({
    format: winston.format.combine(
      winston.format.errors({stack: true}),
      winston.format.timestamp({
        format: "MMM-DD-YYYY HH:mm:ss",
      }),
      winston.format.printf(
        (info) => `${info.level.toUpperCase()}: ${[info.timestamp]}: ${info.stack ? info.stack : info.message}`
      )
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: "./logs/logs.log",
        level: "info",
        maxsize: 10000,
        maxFiles: 1,
        tailable: true
      }),
    ],
    handleExceptions: true,
  })
};
