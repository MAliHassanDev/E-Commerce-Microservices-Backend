import { NextFunction, Request, Response } from "express";
import logger from "../config/logger.ts";
import { getStatusColorCode } from "../utils/middlewareUtils.ts";



export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  next();
  const status = res.statusCode;
  const color = getStatusColorCode(status);
  logger.info(`\x1b[1;33m${req.method}\x1b[0m ${req.url}  \x1b[1;${color}m${status}\x1b[0m `);
}


export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Internal Error: `, err);
  res.json({
    success: false,
    message: "Internal server error",
    data: null,
  })
  
}

