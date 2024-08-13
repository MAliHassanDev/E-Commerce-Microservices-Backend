import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Request received for: ${req.originalUrl}`);
  next();
};

export default requestLogger;
