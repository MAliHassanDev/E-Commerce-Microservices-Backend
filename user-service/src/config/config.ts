import dotenv from "dotenv";
import { join } from "path";

dotenv.config({
  path: join(import.meta.dirname, "..","..", ".env"),
});

class ConfigManager {
  private readonly serverConfig: { port: number; host: string };
  private readonly loggerConfig: { level: string; errorLogFile: string; combinedLogFile: string };
  private readonly databaseConfig: { Mongodb_URI: string };
  private readonly jwtConfig: { secret: string; expiresIn: number };
  private readonly bcryptConfig: {saltRounds: number}
  private readonly env: string = process.env.NODE_ENV || "DEV";
  private static instance: ConfigManager;

  constructor() {
    this.serverConfig = {
      port: ConfigManager.getNumberEnv("PORT", 3000),
      host: process.env.HOST || `127.0.0.1`,
    };
    this.loggerConfig = {
      level: process.env.LOGGER_LEVEL || "info",
      errorLogFile: join(import.meta.dirname, "..", "..", "logs/error.log"),
      combinedLogFile: join(import.meta.dirname, "..", "..", "logs/combined.log"),
    };
    this.databaseConfig = {
      Mongodb_URI: process.env[`MONGODB_URI_${this.env}`] || process.env.MONGODB_URI || `mongodb://localhost:27017/myDb`,
    };
    this.jwtConfig = {
      secret: process.env.JWT_SECRET || "8397a428fc2ac5c84279c3f61e5e417fed25c4a7d9e9fd832bd3719493508d0eef7cac349a088b35bc2e0d0106fc625d1dba84dd79f5b353c519996964f8c96d",
      expiresIn: ConfigManager.getNumberEnv("JWT_EXPIRES_IN", 43200000), // 12h
    };
    this.bcryptConfig = {
      saltRounds: ConfigManager.getNumberEnv('BCRYPT_SALT_ROUNDS', 10),
    }

  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private static getNumberEnv(key: string, defaultValue: number): number {
    const value = process.env[key];
    return value ? parseInt(value, 10) : defaultValue;
  }

  public getServerConfig() {
    return this.serverConfig;
  }

  public getLoggerConfig() {
    return this.loggerConfig;
  }

  public getBcryptConfig() {
    return this.bcryptConfig;
  }

  public getDatabaseConfig() {
    return this.databaseConfig;
  }

  public getJwtConfig() {
    return this.jwtConfig;
  }

  
}

export default ConfigManager.getInstance();
