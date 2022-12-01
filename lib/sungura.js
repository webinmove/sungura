const amqp = require('amqplib');

module.exports.Sungura = class Sungura {
  constructor (options) {
    this.options = options;
    this.logScope = 'RabbitMQ:' || this.options.logScope;

    if (this.options.logger) {
      this.logger = this.options.logger;
    } else {
      this.logger = console;
    }
  }

  async init () {
    this.logger.debug(`${this.logScope} Connection`);
    this.client = await amqp.connect(this.options.rabbitUrl);

    this.logger.debug(`${this.logScope} Create Channel`);
    this.channel = await this.client.createChannel();

    this.logger.debug(`${this.logScope} Assert Exchange`);
    await this.channel.assertExchange(
      this.options.exchange,
      'topic'
    );

    if (this.options.consumer) {
      this.logger.debug(`${this.logScope} Consumer Options detected`);
      const queueOptions = {
        durable: true
      };

      if (this.options.consumer.deadLettering) {
        this.logger.debug(`${this.logScope} Dead Lettering Options detected`);

        this.logger.debug(`${this.logScope} Assert Dead Letter Exchange`);
        this.deadLetterExchange = `${this.options.exchange}.dlx`;
        await this.channel.assertExchange(
          this.deadLetterExchange,
          'topic',
          {
            durable: true,
            autoDelete: false
          }
        );

        queueOptions.arguments = {
          'x-dead-letter-exchange': this.deadLetterExchange,
          'x-dead-letter-routing-key': `${this.options.consumer.scope}.dead`
        };
      }

      this.routingKey = `${this.options.consumer.scope}.#` || this.options.consumer.routingKey;

      this.logger.debug(`${this.logScope} Assert Queue`);
      this.mainQueue = await this.channel.assertQueue(
        this.options.consumer.scope,
        queueOptions
      );

      if (this.options.consumer.deadLettering) {
        const deadLetterQueueName = `${this.options.consumer.scope}-dlx`;
        this.logger.debug(`${this.logScope} Assert Dead Letter Queue`);
        this.deadletterQueue = await this.channel.assertQueue(
          deadLetterQueueName,
          {
            durable: true
          }
        );
      }

      this.logger.debug(`${this.logScope} Assert Bind Queue`);
      await this.channel.bindQueue(
        this.mainQueue.queue,
        this.options.exchange,
        this.routingKey
      );

      if (this.options.consumer.deadLettering) {
        this.logger.debug(`${this.logScope} Assert Bind Dead Letter Queue`);
        await this.channel.bindQueue(
          this.deadletterQueue.queue,
          this.deadLetterExchange,
          this.routingKey
        );
      }
    }

    this.client.on('close', () => {
      this.logger.info(`${this.logScope} connexion closed`);
      this.options.closeHandler();
    });

    this.client.on('error', (error) => {
      this.logger.info(`${this.logScope} connexion error`);
      this.logger.error(error);
      this.options.errorHandler(error);
    });

    this.client.on('blocked', (reason) => {
      this.logger.info(`${this.logScope} connexion blocked`);
      this.logger.error(reason);
      this.options.blockedHandler(reason);
    });

    return true;
  }

  async publish (message, topic) {
    this.logger.debug(`${this.logScope} sending message`);
    return this.channel.publish(
      this.options.exchange,
      topic,
      Buffer.from(message)
    );
  }

  async consume (messageProcessor) {
    this.logger.debug(`${this.logScope} getting message`);
    const msg = await this.channel.get(
      this.mainQueue.queue,
      {
        noAck: false,
        consumerTag: this.options.consumer.scope
      }
    );

    if (msg === null) {
      this.logger.debug(`${this.logScope} Disconnected`);
      return this.client.close();
    }

    if (msg === false) {
      this.logger.debug(`${this.logScope} No Message`);
      return false;
    }

    try {
      await messageProcessor(msg);
      this.channel.ack(msg);
      return msg;
    } catch (error) {
      if (msg.fields.redelivered) {
        this.logger.debug(`${this.logScope} redelivered`);
        await this.channel.nack(msg, false, false);
      } else {
        await this.channel.nack(msg);
      }
      throw error;
    }
  }

  async close () {
    await this.channel.close();
    return this.client.close();
  }
};
