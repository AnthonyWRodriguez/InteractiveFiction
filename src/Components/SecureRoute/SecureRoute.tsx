import React from 'react';
import {Route, Redirect} from 'react-router-dom';

export default(parts:IEnum)=>{
    if(parts.auth.email!=="" || parts.auth.name!==""){
        return(
            <Route render={(...props) => { return (<parts.component {...props} auth={parts.auth}/>) }} path={parts.path} exact />
        )
    }else{
        return(
            <Redirect to="/login"/>        
        )
    }
}
interface IEnum{
    component: any;
    auth: {
        email: string;
        name: string;
        logout?:()=>void;
    };
    path: string;
}