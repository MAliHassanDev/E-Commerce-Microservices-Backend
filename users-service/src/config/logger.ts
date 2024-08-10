import fs from 'fs';
import config from './config.ts';
import getTimeStamp from '../utils/loggerUtils.ts';

interface Log{
  level: string,
  message: string,
  stack?: string,
  timeStamp: string,
}

interface LoggerOptions{
  level?:string,
}

interface LogLevels extends Object{
  error: number,
  warn: number,
  info: number,
  http: number,
  debug: number,
}

const logLevels:LogLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 5,
};

const createLogger = (options?:LoggerOptions) => {
  const { errorLogFile, combinedLogFile } = config.getLoggerConfig();

  const level:string = logLevels.hasOwnProperty(options.level) && options.level ?  options.level : 'info'

  const writeCombinedStream = fs.createWriteStream(combinedLogFile, { encoding: 'utf-8',flags: 'a' });
  const writeErrorStream = fs.createWriteStream(errorLogFile, { encoding: 'utf-8', flags: 'a' });

  writeCombinedStream.on('error', (err) => {
    console.error("Error occurred while writing to file",err)
  })

  writeErrorStream.on('error', (err) => {
    console.error("Error occurred while writing to file",err)
  })

  return {
    info: (message:string,...optionalParams) => {
      if (logLevels['info'] > logLevels[level]) return;
      const timeStamp = getTimeStamp();
      const log = {
        level: 'info',
        message,
        timeStamp,
      };
      const logString = JSON.stringify(log) + '\n';
      writeCombinedStream.write(logString);

      const formattedMessage = `${timeStamp} \x1b[32m%s\x1b[0m: ${message}`
      console.info(formattedMessage, 'info', ...optionalParams);
    },

    error: (message:any,...optionalParams) => {
      if (logLevels['error'] > logLevels[level]) return;
      const timeStamp = getTimeStamp();
      const isError = (message instanceof Error);
      
      const log: Log = {
        level: 'error',
        message: isError ? message.message : message,
        timeStamp,
      };
      if (isError) log.stack = message.stack;

      const logString = JSON.stringify(log) + '\n';
      writeErrorStream.write(logString);

      const formattedMessage = isError ? `${timeStamp} \x1b[31m%s\x1b[0m: ${message.message} ${JSON.stringify({ stack: message.stack })}`
                                       : `${timeStamp} \x1b[31m%s\x1b[0m: ${message}`;  

      console.error(formattedMessage, 'error', ...optionalParams);
    }
  }
}



export default createLogger({
  level: config.getLoggerConfig().level
});

