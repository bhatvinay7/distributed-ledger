import express from "express";
import dotenv from "dotenv";
import consumeMessageFromProjectionQueue from './consumer.js';
dotenv.config();
const PORT=3004
const app = express();
try{
(async () => {
  await  consumeMessageFromProjectionQueue();
})();
}
catch(error:any){
  console.log(error.message)
}

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Consumer collector running on port ${PORT}`);
  });
