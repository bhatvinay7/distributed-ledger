import { createClient,RedisClientType } from "redis";
import dotenv from 'dotenv';
dotenv.config();
const REDIS_USERNAME=process.env.REDIS_USERNAME!
const REDIS_PASSWORD=process.env.REDIS_PASSWORD!
const REDIS_HOST=process.env.REDIS_HOST!
const REDIS_PORT=process.env.REDIS_PORT!
let redis:RedisClientType
const getrRedisClient=async function redisClient():Promise<RedisClientType>{
try{
    if(!redis){
    redis=createClient({
    username: REDIS_USERNAME!,
    password: REDIS_PASSWORD!,
    socket: {
        host: REDIS_HOST!,
        port: parseInt(REDIS_PORT!),
        connectTimeout: 20000,
        keepAlive: true
    }
});  
    await redis.connect();
    }
    redis.on("error", (err:any) => console.log("Redis Client Error", err));
    return redis;
    }  
    catch(error:any){
       throw new Error("Redis connection failed");

    }
}

export default getrRedisClient