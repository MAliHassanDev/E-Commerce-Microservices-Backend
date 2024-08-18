import { NextFunction, Request, Response } from "express";
import logger from "../config/logger.ts";


export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} "${req.originalUrl}"`);
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

