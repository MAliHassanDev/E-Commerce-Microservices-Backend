import mongoose from "mongoose";
import config from "../config/config.ts";
import logger from "../config/logger.ts";

export const connectDb = async () => {
  const { Mongodb_URI } = config.getDatabaseConfig();
  try {
    await mongoose.connect(Mongodb_URI)
  } catch(error) {
    logger.error('Failed to connect to database')    
  }
};

