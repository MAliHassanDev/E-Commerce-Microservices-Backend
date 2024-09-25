import RabbitMQ from "../../../message-broker/src/rabbitmq.ts";
import amqp from 'amqplib';
import logger from "../config/logger.ts";

const rabbitMq = new RabbitMQ();


export const innitRabbitMQ = async () => {
  try {
    await rabbitMq.connect("amqp://admin:password@localhost/");
    logger.info("Connected to RabbitMQ ✔");
    
  } catch (error: any) {
    logger.error(error);
  }
} 





export default rabbitMq;













