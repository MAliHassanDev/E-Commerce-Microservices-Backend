import mongoose from "mongoose"
import config from "../config/config.ts"


export const connectDb = async () => {
  const {Mongodb_URI } = config.getDatabaseConfig();
  await mongoose.connect(Mongodb_URI);
}

