import * as amqp from "amqplib";
import dotenv from "dotenv";
import { join } from "path";
import { v4 as uuidv4 } from 'uuid'

dotenv.config({ path: join(import.meta.dirname, "..", ".env") });

interface IRabbitMQ {
  connect(url?:string): Promise<void>;
  disconnect(): Promise<void>;
  getChannel(): amqp.Channel;
  publishMessage(routingKey: string, message: unknown): void;
  ackMessage(msg: amqp.Message): void;
  sendToQueue(queue:string,content:unknown,options:amqp.Options.Publish): boolean;
  subscribe(
    queue: string,
    routingkeys: string | string[],
    handler: () => void
  ): Promise<void>;
}

interface IAnyRecord{
  [filed:string]: unknown,
}

type MixedContent = string | number | IAnyRecord | [];

class RabbitMQ implements IRabbitMQ {
  private static connection: amqp.Connection;
  private static channel: amqp.Channel;
  private static exchange: string =
    process.env.RABBITMQ_EXCHANGE || "default_exchange";

  public async connect(url?:string): Promise<void> {
    RabbitMQ.connection = await amqp.connect(
      url || process.env.RABBITMQ_URL || "amqp://guest:guest@localhost/"
    );
    RabbitMQ.channel = await RabbitMQ.connection.createChannel();
  }

  public async disconnect(): Promise<void> {
    await RabbitMQ.connection.close();
    await RabbitMQ.channel.close();
  }

  public getChannel(): amqp.Channel {
    if (RabbitMQ.channel == undefined) {
      throw new Error("RabbitMQ channel in uninitialized");
    }
    return RabbitMQ.channel;
  }

  public sendToQueue(queue:string,content:MixedContent,options:amqp.Options.Publish = {}): boolean{
    return RabbitMQ.channel.sendToQueue(
      queue,
      Buffer.from(content.toString()),
      options
    )
  }

  public publishMessage(routingKey: string, message: MixedContent,options:amqp.Options.Publish = {persistent: true}): void {
    if (RabbitMQ.channel == undefined) {
      throw new Error("RabbitMQ channel in uninitialized");
    }
    RabbitMQ.channel.publish(
      RabbitMQ.exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      options,
    );
  }

  public async rpcRequest(routingKey: string,payload:MixedContent):Promise<string> {
    // callback queue
    const { queue } = await RabbitMQ.channel.assertQueue('', {
      exclusive: true,
    });
    const correlationId: string = uuidv4();
    RabbitMQ.channel.publish(
      RabbitMQ.exchange,
      routingKey,
      Buffer.from(JSON.stringify(payload)),
      {
        correlationId,
        replyTo: queue
      }
    );   

    return new Promise((resolve, reject) => {
      RabbitMQ.channel.consume(queue, (msg: amqp.ConsumeMessage | null) => {
        if (msg !== null) resolve(msg.content.toString('utf-8'));
        else reject("Consumer Cancelled by the server");
      }, {
        noAck: true,
      })
    })
  }

  public ackMessage(msg:amqp.Message):void {
    RabbitMQ.channel.ack(msg);
  }

  public async subscribe(
    queue: string,
    routingKeys: string[] | string,
    handler: (msg: amqp.ConsumeMessage | null) => void
  ): Promise<void> {
    
    if (RabbitMQ.channel == undefined) {
      throw new Error("RabbitMQ channel in uninitialized");
    }

    await RabbitMQ.channel.assertExchange(RabbitMQ.exchange, "topic", {
      durable: true,
    });

    await RabbitMQ.channel.assertQueue(queue, {
      durable: true,
    });
    // bind queues with given routingkeys
    const keys = Array.isArray(routingKeys) ? routingKeys : [routingKeys];
    for (const key of keys) {
      await RabbitMQ.channel.bindQueue(queue, RabbitMQ.exchange, key);
    }

    await RabbitMQ.channel.consume(queue, handler, {
      noAck: true,
    });
  }
}
export default RabbitMQ;

