import amqp from 'amqplib';
import logger from '../../config/logger.ts';
import User from '../../database/models/userModel.ts';
import rabbitMq from '../messageQueue.ts';

export async function sendUserProfiles(msg: amqp.ConsumeMessage | null) {
  if (msg === null) { 
    logger.warn("Received null message. Ignoring...");
    return;
  };
  logger.info(`Consuming Message.. Key: ${msg.fields.routingKey}`);  

  const msgContent = JSON.parse(msg.content.toString());
  const userIds: string[] = Array.isArray(msgContent) ? msgContent : [msgContent];
   

  const userProfiles = await Promise.all(userIds.map((userId) => {
    return User.findOne({ "_id": userId },{"name": 1,"email": 1,"avatar": 1,"_id": 1});
  }));

  rabbitMq.sendToQueue(
    msg.properties.replyTo,
    JSON.stringify(userProfiles),
    {
      correlationId: msg.properties.correlationId
    }
  );
}




