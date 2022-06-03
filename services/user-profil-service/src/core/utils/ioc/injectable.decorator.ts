import { InjectorContainer } from "./ioc_container";
import { Type } from "./type.interface";

export function Injectable<T extends Type<any> >()
{
    return (target:T)=>
    {
        InjectorContainer.getInstance().resolveAndSave<T>(target)
    }
}