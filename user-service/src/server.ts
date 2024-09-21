import app from "./app/app.ts";
import config from "./config/config.ts";
import logger from "./config/logger.ts";
import { connectDb } from "./database/connect.ts";

const { host, port } = config.getServerConfig();

connectDb().then(() => {
  logger.info("Connected to database  ✔");
  app.listen(port, host, () => {
    logger.info(`Server running at http://${host}:${port}`);
  })
}).catch(err => {
  logger.error("Failed to connect to database.");
})

