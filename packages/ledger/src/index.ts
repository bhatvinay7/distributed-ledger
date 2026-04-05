import {
  KurrentDBClient,
  NO_STREAM,
  START,
  FORWARDS,
  jsonEvent,
  persistentSubscriptionToAllSettingsFromDefaults,
  ANY,
  streamNameFilter,
} from "@kurrent/kurrentdb-client";
import dotenv from "dotenv";
dotenv.config();

let client: KurrentDBClient | null = null;

const RETRY_MIN_MS = 1000;
const RETRY_MAX_MS = 30000;
const MAX_ATTEMPTS = 10;

function getBackoffDelay(attempt: number): number {
  return Math.min(RETRY_MIN_MS * 2 ** attempt, RETRY_MAX_MS);
}

export async function getKurrentDB(): Promise<KurrentDBClient | undefined> {
  if (client) return client;

  const connectionString =
    process.env.KURRENT_DB_URL ??
    "kurrentdb://kurrent:kurrent-password@kurrent1:2113?tls=false&keepAliveInterval=10000&keepAliveTimeout=10000";

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      client = KurrentDBClient.connectionString(connectionString);
      console.log("KurrentDB connected");
      return client;
    } catch (err: unknown) {
      const wait = getBackoffDelay(attempt);
      const message = err instanceof Error ? err.message : String(err);
      console.error(
        `KurrentDB connection failed (attempt ${attempt + 1}/${MAX_ATTEMPTS}) → retrying in ${wait}ms: ${message}`
      );
      await new Promise((res) => setTimeout(res, wait));
    }
  }

  console.error("KurrentDB connection failed after all retries");
  return undefined;
}

// Eagerly connect on module load so the client is ready before first use.
(async () => {
  await getKurrentDB();
})();

export {
  client,
  START,
  FORWARDS,
  NO_STREAM,
  ANY,
  persistentSubscriptionToAllSettingsFromDefaults,
  streamNameFilter,
  jsonEvent,
};
