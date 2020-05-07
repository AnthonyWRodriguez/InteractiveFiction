import React from 'react';
import Page from '../../Page';
import 'bootstrap/dist/css/bootstrap.css';
import {IAuth} from '../../../Common/Interfaces/Interfaces';

export default(props: React.PropsWithChildren<IAuth>)=>{
    return(
        <Page auth={props.auth}>
            <div className="container">
                <button className="btn btn-danger col-sm-12">PLAY</button>
            </div>
        </Page>
    )
}