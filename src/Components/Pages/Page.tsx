import React from 'react';
import Header from '../Header/Header';
import './Page.css';


export default (props:any)=>{
    return(
        <section className="fill">
            <Header></Header>
            <main className="d-flex align-items-center justify-content-center">
                {props.children}
            </main>
        </section>
    )
}