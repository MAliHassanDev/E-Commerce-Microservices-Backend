import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({
  path: join(import.meta.dirname, '..', '.env')
})


class ConfigManager{
  private readonly serverConfig: { port: number; host: string };
  private readonly loggerConfig: { level: string,errorLogFile: string,combinedLogFile:string };
  private readonly databaseConfig: {Mongodb_URI: string,}
  private readonly env: string = process.env.NODE_ENV || 'DEV';
  private static  instance: ConfigManager;

  constructor() {
    this.serverConfig = {
      port: ConfigManager.getNumberEnv('PORT',3000),
      host: process.env.HOST || `127.0.0.1`
    }
    this.loggerConfig = {
      level: process.env.LOGGER_LEVEL || 'info',
      errorLogFile: join(import.meta.dirname, '..', '..', 'logs/error.log'),
      combinedLogFile: join(import.meta.dirname, '..', '..', 'logs/combined.log'),
    };
    this.databaseConfig = {
      Mongodb_URI: process.env[`MONGODB_URI_${this.env}`] || process.env.MONGODB_URI || `mongodb://localhost:27017/myDb`
    }
  }

  static getInstance(): ConfigManager{
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private static getNumberEnv(key:string,defaultValue:number): number{
    const value = process.env[key];
    return value ? parseInt(value, 10) : defaultValue;
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