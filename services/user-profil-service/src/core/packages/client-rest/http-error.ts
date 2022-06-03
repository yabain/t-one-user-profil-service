import { HttpRequest } from "./http-request";
import { HttpResponse } from "./http-response";

export class HttpError 
{
    
    request:HttpRequest=new HttpRequest();
    response:HttpResponse=new HttpResponse();
    message:String="";

    
    toString() 
    {
        return {
           request:this.request.toString(),
           response:this.response.toString()
        }
    }
}