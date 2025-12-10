import express from "express";
import dotenv from "dotenv";
dotenv.config();
import  {setupSubscriptionGroup,startWorker} from './eventStore-worker.js'
const PORT=3005
try{
(async () => {
  await setupSubscriptionGroup();
  await startWorker();
})();
}
catch(error:any){
  console.log(error.message)
}

const app = express();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Consumer collector running on port ${PORT}`);
  });
