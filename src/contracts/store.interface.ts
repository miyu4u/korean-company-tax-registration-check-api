
export interface store<T> {
     save(key:string, data:T):Promise<boolean>
     find(key:string):Promise<T|undefined>
}