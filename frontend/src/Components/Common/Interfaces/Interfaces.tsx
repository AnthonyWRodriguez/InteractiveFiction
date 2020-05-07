export interface IAuth {
    auth:{
        email: string;
        name: string;
        logout?:()=>void;
    };
    login?: (arg0: string, arg1: string)=>void;
}