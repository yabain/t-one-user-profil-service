import { ActionResult } from "../core/utils/actionresult";
import { RabbitMQClient } from "../core/packages/rabbitmq";
import { RedisClient } from "../core/packages/redis";
import { InjectorContainer } from "../core/utils";
const fs = require('fs');


export class MicroServiceApp
{
    rabbitmqClient:RabbitMQClient=null;
    redisClient:RedisClient=null
    constructor()
    {
        this.redisClient=InjectorContainer.getInstance().getInstanceOf<RedisClient>(RedisClient)
        this.rabbitmqClient=InjectorContainer.getInstance().getInstanceOf<RabbitMQClient>(RabbitMQClient)
    }
    
    start(redishost=process.env.REDIS_HOST || 'localhost',redisport=parseInt(process.env.REDIS_PORT || "6379"))
    {
        this.redisClient.connect(redishost,redisport)
        .then(()=>  this.rabbitmqClient.init((message)=>this.onReceiveMessage(message)))
        .then((e)=>{
            console.log('Initializatin end with ok ')
        })
        .catch((error)=>{
            console.log("Error in IndexeurApp",error)
        })
    }
    onReceiveMessage(text)
    {
        console.log("Try to index file")
    }
}