const winston = require("winston");
module.exports = {
  info: winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp({
        format: "MMM-DD-YYYY HH:mm:ss",
      }),
      winston.format.printf(
        (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
      )
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: "./logs/info-logs.log",
        level: "info",
        maxsize: 10000,
        maxFiles: 1,
        tailable: true
      }),
    ],
    handleExceptions: true,
  }),

  error: winston.createLogger({
    level: "error",
    format: winston.format.combine(
      winston.format.timestamp({
        format: "MMM-DD-YYYY HH:mm:ss",
      }),
      winston.format.printf(
        (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
      )
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: "./logs/error-logs.log",
        level: "error",
        maxsize: 10000,
        maxFiles: 1,
        tailable: true
      }),
    ],
    handleExceptions: true,
  }),
};
