import amqplib,{ConsumeMessage} from 'amqplib';
import dotenv from 'dotenv';
dotenv.config();
const RABBITMQ_CLUSTER_URL = process.env.RABBITMQ_CLUSTER_URL!;
let retryAttempt = 0;
const retryLow = 1000;
const retryHigh = 30000;

function getBackoffDelay(attempt: number) {
  const delay = retryLow * 2 ** attempt;
  return Math.min(delay, retryHigh);
}

async function callRabbit(){
  const projectionQueue= 'projectionqueue';
  const serviceQueue="servicequeue"
  const connection = await amqplib.connect(RABBITMQ_CLUSTER_URL!);

  const projectionChannel = await connection.createChannel();
  await projectionChannel.assertQueue( projectionQueue, { durable: true });

  const serviceChannel= await connection.createChannel();
  await serviceChannel.assertQueue(serviceQueue, { durable: true });
  
  connection.on('error', async (err:any) => {
   const delay = getBackoffDelay(retryAttempt);
   console.log(`Retrying connection in ${delay} ms`)
   setTimeout(() => {
     retryAttempt++;    
    callRabbit();
   }, delay);
 });

 connection.on('connection', () => {
   console.log('Connection successfully (re)established');
   retryAttempt=0
 });
 return {projectionQueue,serviceQueue,serviceChannel,projectionChannel};
}

const {projectionQueue,serviceQueue,serviceChannel,projectionChannel} = await callRabbit();
export {projectionQueue,serviceQueue,serviceChannel,projectionChannel};
export type {ConsumeMessage}