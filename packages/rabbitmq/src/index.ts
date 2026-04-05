import amqplib, { ConsumeMessage, Channel, Connection } from "amqplib";
import dotenv from "dotenv";
dotenv.config();

const RABBITMQ_CLUSTER_URL = process.env.RABBITMQ_CLUSTER_URL!;
const PROJECTION_QUEUE = "projectionqueue";
const SERVICE_QUEUE = "servicequeue";

const RETRY_LOW_MS = 1000;
const RETRY_HIGH_MS = 30000;
const MAX_RETRIES = 15;

function getBackoffDelay(attempt: number): number {
  return Math.min(RETRY_LOW_MS * 2 ** attempt, RETRY_HIGH_MS);
}

// Mutable proxy object — callers import this reference once and it stays
// valid across reconnects because we mutate the same object in-place.
export const projectionChannel = { channel: null as Channel | null };
export const serviceChannel    = { channel: null as Channel | null };
export const projectionQueue   = PROJECTION_QUEUE;
export const serviceQueue      = SERVICE_QUEUE;

// Re-export type so callers can import it alongside the channel helpers.
export type { ConsumeMessage };

// ---------------------------------------------------------------------------
// Internal helpers that delegate to the current channel
// These give callers a stable API that survives reconnects.
// ---------------------------------------------------------------------------

type RabbitMQChannels = {
  projectionChannel: Channel;
  serviceChannel: Channel;
  projectionQueue: string;
  serviceQueue: string;
};

let _channels: RabbitMQChannels | null = null;
let _connecting = false;
let _retryAttempt = 0;

async function connect(): Promise<RabbitMQChannels> {
  if (_connecting) {
    // Wait until the in-flight connect resolves
    await new Promise((r) => setTimeout(r, 500));
    if (_channels) return _channels;
  }

  _connecting = true;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const connection: Connection = await amqplib.connect(RABBITMQ_CLUSTER_URL);

      const projCh = await connection.createChannel();
      await projCh.assertQueue(PROJECTION_QUEUE, { durable: true });

      const svcCh = await connection.createChannel();
      await svcCh.assertQueue(SERVICE_QUEUE, { durable: true });

      connection.on("error", (err: Error) => {
        console.error("RabbitMQ connection error:", err.message);
        _channels = null;
        _connecting = false;
        const delay = getBackoffDelay(_retryAttempt++);
        console.log(`Reconnecting RabbitMQ in ${delay}ms`);
        setTimeout(() => connect().catch(console.error), delay);
      });

      connection.on("close", () => {
        console.warn("RabbitMQ connection closed — reconnecting");
        _channels = null;
        _connecting = false;
        const delay = getBackoffDelay(_retryAttempt++);
        setTimeout(() => connect().catch(console.error), delay);
      });

      _retryAttempt = 0;
      _channels = {
        projectionChannel: projCh,
        serviceChannel: svcCh,
        projectionQueue: PROJECTION_QUEUE,
        serviceQueue: SERVICE_QUEUE,
      };

      console.log("RabbitMQ connected");
      _connecting = false;
      return _channels;
    } catch (err: unknown) {
      const delay = getBackoffDelay(attempt);
      const message = err instanceof Error ? err.message : String(err);
      console.error(`RabbitMQ connect attempt ${attempt + 1} failed: ${message}. Retrying in ${delay}ms`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  _connecting = false;
  throw new Error("RabbitMQ: exhausted all connection retries");
}

// ---------------------------------------------------------------------------
// Stable, re-connectable channel accessors for use by consumers/publishers.
// Callers: `const { projectionChannel } = await getRabbitMQChannels();`
// ---------------------------------------------------------------------------
export async function getRabbitMQChannels(): Promise<RabbitMQChannels> {
  if (_channels) return _channels;
  return connect();
}

// Eagerly connect on module load.
await connect();
