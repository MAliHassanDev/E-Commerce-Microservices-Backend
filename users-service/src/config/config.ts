import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({
  path: join(import.meta.dirname, '..', '.env')
})


class ConfigManager{
  private serverConfig: { port: number; host: string };
  private loggerConfig: { level: string };
  private static  instance: ConfigManager;


  constructor() {
    this.serverConfig = {
      port: Number(process.env.PORT) || 3000,
      host: process.env.HOST || `127.0.0.1`
    }
    this.loggerConfig = {
      level: process.env.LOGGER_LEVEL || 'info'
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
}

export default ConfigManager.getInstance();