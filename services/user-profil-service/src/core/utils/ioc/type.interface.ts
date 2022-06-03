export interface Type<T>
{
    new(...args: any[]): T;
}

export interface Constructor
{
    new(...args: any[]):any;
}