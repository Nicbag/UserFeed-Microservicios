import amqp, { Channel, Connection } from 'amqplib';
import config from '@config/index';
import logger from '@utils/logger';
import feedAndUserFeedService from '@services/feedAndUserFeed.service';
import { OrderMessage } from '@dtos/feed.dto';
import { CustomError } from '@config/errors/error.model';

export class Rabbit {
  private static instance: Rabbit;
  private connection: Connection | null = null;
  private orderChannel: Channel | null = null;

  private constructor() {
    this.connect();
  }

  public static getInstance(): Rabbit {
    if (!Rabbit.instance) {
      Rabbit.instance = new Rabbit();
    }
    return Rabbit.instance;
  }

  public async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(config.RABBIT_URL);
      this.connection.on('close', () => this.handleConnectionClose());
      this.connection.on('error', (err) => this.handleConnectionError(err));
      await this.setupChannels();
      logger.info('🚀 Connected to RabbitMQ');
    } catch (err) {
      logger.error(`Error connecting to RabbitMQ: ${err}`);
      this.retryConnection();
    }
  }

  private async setupChannels(): Promise<void> {
    if (!this.connection) {
      throw new CustomError('Rabbit connection failed',500);
    }
    this.orderChannel = await this.connection.createChannel();
    await this.orderChannel.assertQueue(config.QUEUE_ORDERS); // cola para recibir las órdenes que se crean
    this.orderChannel.consume(config.QUEUE_ORDERS, this.handleOrderPlaced.bind(this),{noAck: true})
  
  }

  private async  handleOrderPlaced(msg : amqp.ConsumeMessage | null){
    if(!msg) return;

        try {
      // Deserializa el mensaje recibido (asumiendo que el mensaje es JSON)
      const orderData : OrderMessage = JSON.parse(msg.content.toString());

      //se valida el mensaje
      if (
        typeof orderData.user_id !== 'string' ||
        !Array.isArray(orderData.articles) ||
        orderData.articles.some(
          (article: any) =>
            typeof article.article_id !== 'string' ||
            typeof article.quantity !== 'number' ||
            article.cantidad <= 0
        )
      ) {
        throw new Error('Mensaje inválido');
      }

      console.log("Pasó validaciones")

      // Ahora se procesa la lógica de negocio con la data de la orden
      await feedAndUserFeedService.newOrderHandler(orderData);
    
      
    } catch (error) {
      console.error('Error processing the order:', error);
    }
  }

  private handleConnectionClose(): void {
    logger.error('Connection to RabbitMQ closed');
    this.retryConnection();
  }

  private handleConnectionError(err: Error): void {
    logger.error(`Connection error to RabbitMQ: ${err}`);
    this.retryConnection();
  }

  private retryConnection(): void {
    setTimeout(() => {
      this.connect().catch((err) => {
        logger.error(`Error retrying connection to RabbitMQ: ${err}`);
      });
    }, 5000);
  }

  public async close(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
    }
  }
}
