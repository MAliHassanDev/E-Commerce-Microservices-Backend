import app from "./app/app.ts";
import config from "./config/config.ts";
import logger from "./config/logger.ts";
import { connectDb } from "./database/connection.ts";
import { innitRabbitMQ } from "./messaging/messageQueue.ts";
const { host, port } = config.getServerConfig();



(async () => {
  try {
    await connectDb();
    logger.info("Connected to database  ✔");

    app.listen(port, host, () => {
      logger.info(`Server running at http://${host}:${port}`);
    });
    
    await innitRabbitMQ();

  } catch (error: any) {
    logger.error("Failed to connect: %o", error);
  }
})();
