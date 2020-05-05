import React from 'react';
import Header from '../Header/Header';
import './Page.css';

interface IPageProps{
}

export default (props: React.PropsWithChildren<IPageProps>)=>{
    return(
        <section className="fill">
            <Header></Header>
            <main className="d-flex align-items-center">
                {props.children}
            </main>
        </section>
    )
}