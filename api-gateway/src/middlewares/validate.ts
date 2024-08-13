import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import logger from "../config/logger";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.headers["authorization"];
  const token = authHeaders && authHeaders.split(" ")[1];
  if (!token) {
    res.setHeader(`WWW-Authenticate`,`Bearer`);
    res.status(401).json({
      success: false,
      message: "Unauthorized to access this resource.",
      data: null,
    });
    return;
  }

  const { secret } = config.getJwtConfig();

  
  jwt.verify(token, secret, (error, decdoded) => {
    if (!error) return next();
    logger.info('Token verification failed for: ',req.originalUrl)
    res.setHeader(`WWW-Authenticate`,`Bearer`);
    res.status(401).json({
      success: false,
      message: "The authorization credentials provided for the request are invalid.",
      data: null,
    });
  });           
};
