import { KurrentDBClient, NO_STREAM,START,FORWARDS,jsonEvent,persistentSubscriptionToAllSettingsFromDefaults,ANY,
streamNameFilter} from "@kurrent/kurrentdb-client";

let client: KurrentDBClient | null = null;

const RETRY_MIN = 1000
const RETRY_MAX = 30000

function getBackoffDelay(attempt: number) {
  return Math.min(RETRY_MIN * 2 ** attempt, RETRY_MAX);
}

export async function getKurrentDB(): Promise<KurrentDBClient |undefined> {
  if (client) return client;

  let attempt = 0;

  while (true) {
    try {
      client =  KurrentDBClient.connectionString`kurrentdb://kurrent:kurrent-password@kurrent1:2113?tls=false&keepAliveInterval=10000&keepAliveTimeout=10000`;
      console.log(" KurrentDB connected");
      return client;
    } catch (err:any) {
      if(attempt<=3){

        const wait = getBackoffDelay(attempt);
        console.error(
          `KurrentDB connection failed (attempt ${attempt}) → retrying in ${wait}ms`
        );
        
        await new Promise((res) => setTimeout(res, wait));
        attempt++;
      }
      else{
        break;
      }   
    }
  }
}


(async () => {
  await getKurrentDB();
})();

export {client,START,FORWARDS,NO_STREAM,ANY,persistentSubscriptionToAllSettingsFromDefaults,
streamNameFilter,jsonEvent};
