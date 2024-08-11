import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({
  path: join(import.meta.dirname, '..', '.env')
})


class ConfigManager{
  private serverConfig: { port: number; host: string };
  private loggerConfig: { level: string,errorLogFile: string,combinedLogFile:string };
  private databaseConfig: {Mongodb_URI: string,}
  private static  instance: ConfigManager;
  private env: string = process.env.NODE_ENV || 'DEV';

  constructor() {
    this.serverConfig = {
      port: Number(process.env.PORT) || 3000,
      host: process.env.HOST || `127.0.0.1`
    }
    this.loggerConfig = {
      level: process.env.LOGGER_LEVEL || 'info',
      errorLogFile: join(import.meta.dirname, '..', '..', 'logs/error.log'),
      combinedLogFile: join(import.meta.dirname, '..', '..', 'logs/combined.log'),
    };
    this.databaseConfig = {
      Mongodb_URI: `process.env.MONGODB_URI_${this.env}` || process.env.MONGODB_URI || `mongodb://localhost:27017/myDb`
    }
  }

  static getInstance(): ConfigManager{
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public getServerConfig() {
    return this.serverConfig;
  }

  public getLoggerConfig() {
    return this.loggerConfig;
  }

  public getDatabaseConfig() {
    return this.databaseConfig;
  }
}

export default ConfigManager.getInstance();