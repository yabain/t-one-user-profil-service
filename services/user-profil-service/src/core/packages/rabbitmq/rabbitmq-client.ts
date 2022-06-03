import * as amqp from "amqplib/callback_api"
import { Injectable } from "./../../utils";
import { ActionResult } from "./../../utils/actionresult";
import { InjectorContainer } from "./../../utils/ioc/ioc_container";
import { RedisClient } from "../redis"
import { RabbitMQExchangeType } from "./rabbitmq-exchage.enum";

export class RabbitMQClient
{
    private redisClient:RedisClient=null;
    private config:Record<string,any>={}
    private amqpClient:amqp.Connection=null;
    private channel:amqp.Channel=null;
    private callbackForDefaultQueue:Function=null;

    constructor(){
        this.redisClient=InjectorContainer.getInstance().getInstanceOf<RedisClient>(RedisClient)

    }
    init(callbackForDefaultQueue:Function=(message)=>console.log('IA-Decideur: received new message ',message.content.toString()))
    {
        this.callbackForDefaultQueue=callbackForDefaultQueue
        return this.initiation()
    }
    private initiation()
    {
        let action=new ActionResult<boolean>()

        return new Promise<ActionResult<boolean>>((resolve,reject)=>{
            this.getParameter()
            .then(()=>this.connect())
            .then(()=>this.createNewChannel("y_legal",RabbitMQExchangeType.MESSAGE_TO_ONE))
            .then((channel)=>{
                this.channel=channel.result
                this.createNewQueue(this.config.default_queue_name,this.config.default_queue_name,"y_legal",this.callbackForDefaultQueue)
                action.result=true
                resolve(action)
            })  
            .catch((error)=> {
                action.result=false
                reject(action)
                console.log("Error in RabbitMQClient :",error.result)
                process.exit()
            })
        })
    }

    getParameter():Promise<ActionResult<boolean>>
    {
        let action = new ActionResult<boolean>()
        return new Promise<ActionResult<boolean>>((resolve,reject)=>{
            Promise.all([
                this.redisClient.get<string>("rabbitmq_server_host"),
                this.redisClient.get<number>("rabbitmq_server_port"),
                this.redisClient.get<string>("indexeur_default_queue_name")
            ])
            .then((result)=>{
                this.config.rabbitmq_server_host=result[0].result
                this.config.rabbitmq_server_port=result[1].result
                this.config.default_queue_name=result[2].result
                console.log("Config ",this.config)
                action.result=true;
                resolve(action)
            })
            .catch((error)=>{
                action.result=false;
                reject(action)
            })
        } )
    }

    connect():Promise<ActionResult<boolean>>
    {
        return new Promise<ActionResult<boolean>>((resolve,reject)=>{
            amqp.connect(`amqp://${this.config.rabbitmq_server_host}:${this.config.rabbitmq_server_port}?heartbeat=60`,
                (error,client:amqp.Connection)=>{
                    let action=new ActionResult<boolean>()
                    if(error)
                    {
                        console.log("Rabbitmq error ",error)
                        action.result=error;
                        return reject(action)
                    }
                    console.log("RabbitMQ Connexion ok")
                    this.amqpClient=client;
                    action.result=true;
                    resolve(action)
                    this.amqpClient.on("close",()=>{
                        console.log("Reconnecting...")
                        return this.initiation()
                    })
                }
            )
        })
        
    }
    disconnect()
    {
        this.amqpClient.close()
    }

    createNewChannel(exchange_name="",exchange_type:RabbitMQExchangeType=RabbitMQExchangeType.MESSAGE_TO_ALL):Promise<ActionResult<amqp.Channel>>
    {
        return new Promise<ActionResult<amqp.Channel>>((resolve,reject)=>{
            this.amqpClient.createChannel((error,channel)=>{
                let action=new ActionResult<amqp.Channel>()
                if(error)
                {
                    console.log("Error in Channel",error)
                    action.result=error;
                    return reject(action)
                }
                channel.assertExchange(exchange_name,exchange_type,{
                    durable:false
                })
                console.log("RabbitMQ Channel declare OK")
                action.result=channel;
                resolve(action)
            })
        })            
    }
    
    createNewQueue(queueName,routing_key="",exchange_name="",
        callbackOnReceivedMessageFromQueue:Function=(message)=>console.log(message)):Promise<ActionResult<boolean>>
    {
        let action:ActionResult<boolean>=new ActionResult<boolean>()
        return new Promise<ActionResult<boolean>>((resolve,reject)=>{
            this.channel.assertQueue(queueName,{},(error,queue)=>{
                if(error)
                {
                    console.log("Error declaring queue ",error)
                    action.result=false;
                    return reject(action)
                }
                if(exchange_name) this.channel.bindQueue(queue.queue,exchange_name,routing_key)
                this.channel.consume(queue.queue,(message:amqp.Message)=>this.onReceiveMessage(message,callbackOnReceivedMessageFromQueue), {
                    noAck: true,
                    exclusive:true
                  })
                action.result=true;
                resolve(action)
            })
        })
        
    }
    sendMessage(data,routing_key="",exchange="")
    {
        this.channel.publish(exchange,routing_key,Buffer.from(data))
    }
    onReceiveMessage(message:amqp.Message, callback:Function=null)
    {
        if(!message) return;
        // this.channel.ack(message)
        console.log(callback)
        callback(message.content.toString())
    }
}