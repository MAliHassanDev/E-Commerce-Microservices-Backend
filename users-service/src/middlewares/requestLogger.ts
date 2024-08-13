import { NextFunction, Request, Response } from "express";
import logger from "../config/logger.ts";
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`[users-service]: Request received for: ${req.originalUrl}`);
  next();
};

export default requestLogger;
