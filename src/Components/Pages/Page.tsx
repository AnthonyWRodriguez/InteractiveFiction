import React from 'react';
import Header from '../Header/Header';
import './Page.css';
import {IAuth} from '../Common/Interfaces/Interfaces';


export default (props: React.PropsWithChildren<IAuth>)=>{
    return(
        <section className="fill">
            <Header auth={props.auth}></Header>
            <main className="d-flex align-items-center justify-content-center">
                {props.children}
            </main>
        </section>
    )
}