import {projectionQueue,serviceQueue,serviceChannel,projectionChannel,ConsumeMessage} from 'rabbitmq';
import { processTransaction } from './processTransaction.js';
async function  consumeMessageFromProjectionQueue(){
      try{
        projectionChannel.consume(projectionQueue, async(msg:ConsumeMessage |null) => {
          if (msg !== null) {
           await processTransaction(JSON.parse(msg.toString()))
            projectionChannel.ack(msg);
          } else {
            console.log('Consumer cancelled by server');
          } 
      });
    }
      catch(error:any){
          console.log(error.message);
      }

}

export default consumeMessageFromProjectionQueue