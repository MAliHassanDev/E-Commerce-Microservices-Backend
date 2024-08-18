import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Request received for: ${req.originalUrl}`);
  next();
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Internal Error: `, err);
  res.json({
    success: false,
    message: "Internal server error",
    data: null,
  })
  
}

