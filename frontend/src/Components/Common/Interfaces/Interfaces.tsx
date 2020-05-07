export interface IAuth {
    auth:{
        email: string;
        logout?:()=>void;
    };
    log_in?: (arg0: string, arg1: string)=>void;

}