import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export const validateIdParam = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    console.log(id);
    return res.status(400).json({
      success: false,
      message: "Missing required parameter: id",
      data: null,
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid request parameter: id",
      data: null,
    });
  }
  next();
};


