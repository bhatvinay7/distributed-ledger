import { getRabbitMQChannels } from "rabbitmq";

// Bug fix: payload is a plain object — Buffer.from(object) throws.
// Stringify before encoding. Fetch channels via getRabbitMQChannels() so
// the reference is always fresh even after a RabbitMQ reconnect.
async function pushMessageToqueue(message: Record<string, unknown>): Promise<void> {
  try {
    const { projectionChannel, projectionQueue } = await getRabbitMQChannels();
    const json = JSON.stringify(message);
    projectionChannel.sendToQueue(projectionQueue, Buffer.from(json), { persistent: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Failed to push message to queue:", message);
  }
}

export default pushMessageToqueue;
