/**
* @author Cedric nguendap
* @description Cette class represente le resultat d'une action et qui requiere des informations 
*    sur le resultat
* @created 23/09/2020
* @modified by Cedric nguendap 19/10/2020
*/
export class ActionResult<T>
{
    public message="";
    public description="";
    public resultCode=0;
    public result:T=null;
    static RESSOURCE_NOT_FOUND_ERROR=-1;
    static NETWORK_ERROR=-2;
    static INVALID_ARGUMENT=-3;
    static UNKNOW_ERROR=-10;
    static SUCCESS=0;
    static RESSOURCE_ALREADY_EXIST_ERROR=-4;
    constructor(code=ActionResult.SUCCESS,message="success",description='',result=null) {
        this.resultCode=code;
        this.message=message;
        this.description=description;
        this.result=result;
    }
}
