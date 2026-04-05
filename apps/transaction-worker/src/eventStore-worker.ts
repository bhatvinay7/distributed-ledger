import { client, persistentSubscriptionToAllSettingsFromDefaults, streamNameFilter } from "ledger";
import processTransactionEvent from "./transaction.js";
import type { TransactionEvent } from "types";

async function setupSubscriptionGroup(): Promise<void> {
  try {
    await client?.createPersistentSubscriptionToAll(
      "transactions-workers",
      persistentSubscriptionToAllSettingsFromDefaults(),
      { filter: streamNameFilter({ prefixes: ["transactions-"] }) }
    );
    console.log("Persistent subscription group created: transactions-workers");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("GroupAlreadyExists")) {
      console.log("Subscription group already exists, skipping creation.");
    } else {
      console.error("Error creating subscription group:", message);
    }
  }
}

async function startWorker(): Promise<void> {
  console.log("Transaction Worker Started...");

  const subscription = client?.subscribeToPersistentSubscriptionToAll("transactions-workers");

  try {
    if (subscription) {
      for await (const resolved of subscription) {
        const event = resolved.event;
        if (!event) continue;

        console.log(`Handling event ${event.type} retryCount=${resolved.retryCount}`);

        // The kurrentdb-client deserializes JSON events into typed data/metadata.
        // We reconstruct the domain TransactionEvent from the recorded event fields.
        const domainEvent: TransactionEvent = {
          type: event.type as TransactionEvent["type"],
          data: event.data as TransactionEvent["data"],
          metadata: event.metadata as TransactionEvent["metadata"],
        };

        try {
          await processTransactionEvent(domainEvent);
          await subscription.ack(resolved);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "processing failed";
          console.error("Failed processing event, will retry:", message);
          await subscription.nack("retry", message, resolved);
        }
      }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Subscription was dropped:", message);
  }
}

export { setupSubscriptionGroup, startWorker };
