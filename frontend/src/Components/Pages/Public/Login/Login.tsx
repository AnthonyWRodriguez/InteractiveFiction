import React, {Component} from 'react';
import Page from '../../Page';
import 'bootstrap/dist/css/bootstrap.css';
import './Login.css';

export default class Header extends Component<IHeaderProps, IHeaderState>{
    constructor(props: IHeaderProps){
        super(props);
    }
    render(){
        return(
            <Page>
                <div className="container">
                    <input type="text" className="form-control bg-transparent text-white" 
                    aria-label="Default" aria-describedby="inputGroup-sizing-default"
                    placeholder="Enter your email"/>
                    &nbsp;
                    <button className="col-sm-12 btn-secondary">Log In</button>
                </div>
            </Page>
        )
    }
}
interface IHeaderProps{

}

interface IHeaderState{

}
