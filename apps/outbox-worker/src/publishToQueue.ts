import {projectionQueue,projectionChannel} from 'rabbitmq'
async function pushMessageToqueue(message:string){
    try{
    projectionChannel.sendToQueue(projectionQueue, Buffer.from(message));
    }
    catch(error:any){
        console.log(error.message);
    }
}
export default pushMessageToqueue;