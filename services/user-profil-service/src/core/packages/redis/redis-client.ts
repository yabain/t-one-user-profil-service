import { createClient } from "redis"
import { Injectable } from "./../..//utils"
import { ActionResult } from "./../..//utils/actionresult"

export class RedisClient
{
    private redisClient:any=""
    private hostname:string=""
    private port:number=0
    
    handleError(error:any)
    {
        console.log('Redis client error ',error)
    }
    connect(hostname:string,port:number):Promise<ActionResult<boolean>>
    {
        this.redisClient = createClient({
            url:`redis://${hostname}:${port}`
        })
        this.redisClient.on('Redis error',(err:any) => this.handleError(err))

        return new Promise<ActionResult<boolean>>((resolve,reject)=>{
            this.redisClient.connect()
            .then((e)=>{

                let action=new ActionResult<boolean>()
                action.result=true;
                resolve(action)
            })
            .catch((e)=>{
                console.log("redis error",e)
                let action = new ActionResult<boolean>()
                action.result=false;
                reject(action)
            })
        })
    }

    set(key:any,value:any):Promise<ActionResult<boolean>>
    {
        return new Promise<ActionResult<boolean>>((resolve,reject)=>{
            this.redisClient.set(key,value)
            .then(()=>{
                let action=new ActionResult<boolean>()
                action.result=true;
                resolve(action)
            })
            .catch(()=>{
                let action = new ActionResult<boolean>()
                action.result=false;
                reject(action)
            })
        })
    }

    get<T>(key:any):Promise<ActionResult<T>>
    {
        return new Promise<ActionResult<T>>((resolve,reject)=>{
            this.redisClient.get(key)
            .then((result)=>{
                let action=new ActionResult<T>()
                action.result=result;
                resolve(action)
            })
            .catch((e)=>{
                console.log("get error ",e)
                let action = new ActionResult<boolean>()
                action.result=false;
                reject(action)
            })
        })
    }
    
}