import axios from 'axios';
import { createBrowserHistory } from "history";

export default createBrowserHistory();

let normalAxios = axios.create();
normalAxios.defaults.headers.common['cache-control'] = "no-cache";
normalAxios.defaults.headers.post['Content-Type'] = "no-cache";
normalAxios.defaults.headers.put['Content-Type'] = "no-cache";

export const naxios = normalAxios;

let secureAxios = axios.create();
secureAxios.defaults.headers.common['cache-control'] = "no-cache";
secureAxios.defaults.headers.post['Content-Type'] = "no-cache";
secureAxios.defaults.headers.put['Content-Type'] = "no-cache";

export const setJWTBearer = (jwt:any) => {
    secureAxios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
  }

export const saxios = secureAxios;

const localStorageAvailable = (()=>{
    let b = 'b';
    try{
        localStorage.setItem(b, b);
        localStorage.removeItem(b);
        return true;
    }catch(e){
        return false;
    }
});

export const setLocalStorage = (key:string, value:string)=>{
    if(localStorageAvailable()){
        localStorage.setItem(key, value);
        return true;
    }else{
        return false;
    }
}

export const getLocalStorage = (key:string)=>{
    if(localStorageAvailable()){
        return localStorage.getItem(key);
    }else{
        return null;
    }
}

export const removeLocalStorage = (key:string)=>{
    if(localStorageAvailable()){
        localStorage.removeItem(key);
        return true;
    }else{
        return false;
    }
}