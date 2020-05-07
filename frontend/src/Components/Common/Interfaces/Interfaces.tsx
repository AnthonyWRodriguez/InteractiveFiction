export interface IAuth {
    auth:{
        name: string;
    };
    log_in?: (
        arg0: string,
        arg1: string
    )=>void;
}