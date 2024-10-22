import winston from "winston";
import "winston-daily-rotate-file"

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`
  })
)

const rotateTransport = new (winston.transports.DailyRotateFile) ({
  filename: 'application-%DATE%.log',
  // Creates a new log file each HOUR
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
  maxFiles: '14d',
  dirname: "./src/logs"

})

const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    rotateTransport,
  ],

})


if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger