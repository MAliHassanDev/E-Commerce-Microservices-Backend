import RabbitMQ from "../../../message-broker/src/rabbitmq.ts";
import logger from "../config/logger.ts";
import { sendUserProfiles } from "./handlers/userHandler.ts";

const rabbitMq = new RabbitMQ();

export const initRabbitMQ = async () => {
  try {
    await rabbitMq.connect("amqp://admin:password@localhost/");
    logger.info("Connected to RabbitMQ ✔");
    rabbitMq.subscribe("user-service-rpc-user-profile-queue", "user.profile.get", sendUserProfiles);
  } catch (error: any) {
    logger.error(error);
  }
};

export default rabbitMq;
