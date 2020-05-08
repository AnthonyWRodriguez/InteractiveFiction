import React from 'react';
import './Input.css'
interface IInputProps{
    name: string, 
    value: string, 
    type: string, 
    caption: string, 
    onChange?: any, 
    error?: object, 
    className: string,
    placeholder: string
}

export default (props: React.PropsWithChildren<IInputProps>)=>{
    return(
        <fieldset>
            <legend className="main-color">{props.caption}</legend>
            <br/>
            <input type={props.type||"text"} name={props.name} 
            id={props.name} value={props.value} className={props.error ? props.className+' error': props.className}
            onChange={(props.onChange || ((e)=>false))} placeholder={props.placeholder}
            />
            <br/>
            <br/>
            {(props.error && true) ? (<span className="center orange font-weight-bold">{props.error}</span>) : null}
        </fieldset>
    );
}