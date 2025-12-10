import express from "express";
import dotenv from "dotenv";
import {startOutboxWorker} from './process-trasaction.js';
dotenv.config();
const PORT=3006
try{
(async () => {
  await  startOutboxWorker();
})();
}
catch(error:any){
  console.log(error.message)
}

const app = express();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Consumer collector running on port ${PORT}`);
  });
