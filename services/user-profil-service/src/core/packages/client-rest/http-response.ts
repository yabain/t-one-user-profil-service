

export class HttpResponse
{
    
    private _header:Record<string | number,string>={}; 
    private _status:number=200;
    private _statusText:String='OK';
    private _config:Record<string | number,string>={};
    private _data:any={};
    private _request:Record<string | number,string>={}; 

    
    header(key:string,value:any):HttpResponse
    {
        this._header[key]=value;
        return this;
    }
    headers(headers:Record<string | number,string>={}):HttpResponse
    {
        this._header={...this._header,...headers}
        return this;
    }
    data(data:any):HttpResponse
    {
        this._data=data;
        return this;
    }
    status(status:number):HttpResponse
    {
        this._status=status;
        return this;
    }
    statusText(statusText:String):HttpResponse
    {
        this._statusText=statusText
        return this;
    }
    config(conf:Record<string | number,string>={}):HttpResponse
    {
        this._config=conf;
        return this;
    }
   
    toString() 
    {
        return {
           config:this._config,
           header:this._header,
            status:this._status,
            data:this._data
        }
    }

    getData():any
    {
        return this._data
    }
}