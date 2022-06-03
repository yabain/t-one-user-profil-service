import axios, { AxiosResponse } from 'axios';
import { ActionResult } from './../../utils';
import { Http } from './http';
import { HttpError } from './http-error';
import { HttpRequest } from './http-request';
import { HttpResponse } from './http-response';

export class RestApi extends Http
{
    sendRequest(request:HttpRequest):Promise<ActionResult<HttpResponse>>
    {
        return new Promise<ActionResult<HttpResponse>>((resolve,reject)=>{

            axios(request.toString())
            .then((response:AxiosResponse)=>{
            let actionResult=new ActionResult<HttpResponse>();
                // console.log("response",response.data)
                actionResult.result=new HttpResponse()
                .status(response.status)
                .data(response.data)
                .statusText(response.statusText)
                .headers(response.headers);
                resolve(actionResult)
            })
            .catch((error)=>{
            let actionResult=new ActionResult<HttpError>();
                console.log("Error ",error)
                let kerror=new HttpError();
                kerror.response=new HttpResponse()
                .status(error.response.status)
                .data(error.response.data)
                .statusText(error.response.statusText)
                .headers(error.response.headers);
                actionResult.result=kerror
                actionResult.resultCode=ActionResult.UNKNOW_ERROR;
                
                reject(actionResult)
            })
        });
    }
}