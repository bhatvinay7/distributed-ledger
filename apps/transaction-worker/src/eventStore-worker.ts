import { client, persistentSubscriptionToAllSettingsFromDefaults, streamNameFilter } from "ledger";
import processTransactionEvent  from "./transaction.js";
import {TransactionEvent} from 'types'
async function setupSubscriptionGroup() {
  try {
    await client?.createPersistentSubscriptionToAll(
      "transactions-workers",
      persistentSubscriptionToAllSettingsFromDefaults(),
      { filter: streamNameFilter({ prefixes: ["transactions-"] }) }
    );
    console.log("Persistent subscription group created: transactions-workers");
  } catch (err: any) {
    if (err?.message?.includes("GroupAlreadyExists")) {
      console.log("Subscription group already exists, skipping creation.");
    } else {
      console.error("Error creating subscription group:", err);
    }
  }
}

async function startWorker() {
  console.log("Transaction Worker Started...");

  const subscription = client?.subscribeToPersistentSubscriptionToAll("transactions-workers");

  try {

    if(subscription){

      for await (const resolved of subscription) {
        const event = resolved.event as any;
        if (!event) continue;
        
        console.log(`Handling event ${event.type} retryCount=${resolved.retryCount}`);
        
        try {
          await processTransactionEvent(event);
          await subscription.ack(resolved)
        } catch (err:any) {
          console.error("Failed processing event, will retry:", err);
          await subscription.nack("retry", err?.message || "processing failed", resolved);
        }
      }
    }
    } catch (error) {
      console.error("Subscription was dropped:", error);
    }
  }

  export {setupSubscriptionGroup,startWorker}
