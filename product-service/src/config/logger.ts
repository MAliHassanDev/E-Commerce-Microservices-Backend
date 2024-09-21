import { createLogger,transports,format } from 'winston';
import config from './config.ts';






const logger = createLogger({
  level: config.getLoggerConfig().level,
  format: format.combine(
    format.json(),
    format.timestamp({
      format: 'DD-MM-YYYY HH:mm:SS',
      
    }),
    format.errors({
      stack: true,
    }),
    format.splat(),
  ),
  transports: [
    new transports.File({
      filename: config.getLoggerConfig().combinedLogFile
    }),
    new transports.File({
      level: 'error',
      filename: config.getLoggerConfig().errorLogFile
    })
  ]
});


if (process.env.NODE_ENV !== 'PROD') {
  logger.add(new transports.Console({
    level: 'debug',
    format: format.combine(
      format.colorize(),
      format.prettyPrint({
        colorize: true
      }),
      format.splat(),
      format.printf((info) => {
        const { level, message, timestamp,...rest} = info;
        if (Object.keys(rest).length > 0) {
          return `${timestamp} ${level}: ${message} ${JSON.stringify(rest)}`
        }
        return `${timestamp} [product-service]: ${level}: ${message}`
      })
    )
  }))
}

export default logger;
