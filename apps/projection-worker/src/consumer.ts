import { getRabbitMQChannels, ConsumeMessage } from "rabbitmq";
import { processTransaction } from "./processTransaction.js";

async function consumeMessageFromProjectionQueue(): Promise<void> {
  try {
    const { projectionChannel, projectionQueue } = await getRabbitMQChannels();

    // prefetch(1) ensures at-most-one unacked message per worker — prevents
    // a slow consumer from being flooded when restarted after backlog builds up.
    await projectionChannel.prefetch(1);

    projectionChannel.consume(projectionQueue, async (msg: ConsumeMessage | null) => {
      if (msg === null) {
        console.warn("Consumer cancelled by server — will reconnect");
        return;
      }

      try {
        // Bug fix: msg is an AMQP ConsumeMessage object.
        // msg.toString() gives "[object Object]" — actual bytes are in msg.content.
        const payload = JSON.parse(msg.content.toString());
        await processTransaction(payload);
        projectionChannel.ack(msg);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error("processTransaction failed:", errMsg);
        // nack without requeue to avoid a poison-message loop
        projectionChannel.nack(msg, false, false);
      }
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("consumeMessageFromProjectionQueue error:", msg);
  }
}

export default consumeMessageFromProjectionQueue;
