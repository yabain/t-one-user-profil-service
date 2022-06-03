import { ActionResult } from "./../../utils/actionresult";
import { HttpRequest } from "./http-request";
import { HttpResponse } from "./http-response";

/**
 * @description Cette classe represente la classe de base de tout client et serveur HTTP 
 * @author Cédric Nguendap
 * @created 17/11/2020
 */
export abstract class Http
{
    abstract sendRequest(request:HttpRequest):Promise<ActionResult<HttpResponse>>
}