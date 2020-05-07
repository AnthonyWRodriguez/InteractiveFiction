import React, {Component} from 'react';
import Page from '../../Page';
import 'bootstrap/dist/css/bootstrap.css';
import {IAuth} from '../../../Common/Interfaces/Interfaces';
import {removeLocalStorage } from '../../../Utilities/Utilities';
import { Redirect } from 'react-router-dom';

export default class Login extends Component<IAuth, IHomeState>{
    constructor(props: IAuth){
        super(props);
        this.state={
            redirect: false,
            redirectTo: ''
        }
    }
    onClickBtn = (e: React.MouseEvent<HTMLButtonElement>)=>{
        if(this.props.auth.email){
            alert("Welcome back "+this.props.auth.name);
            this.setState({
                redirect: true,
                redirectTo: '/game'
            })
        }else{
            alert("To play you need a character first");
            this.setState({
                redirect: true,
                redirectTo: '/login'
            })
        }
    }
    render(){
        removeLocalStorage("potentialEmail");
        if(this.state.redirect){
            const dir:string = (this.state.redirectTo||'/');
            return (<Redirect to={dir} />);
        }
        return(
            <Page auth={this.props.auth}>
                <div className="container">
                    <button 
                        className="btn btn-danger col-sm-12"
                        onClick={this.onClickBtn}
                    >
                        PLAY
                    </button>
                </div>
            </Page>
        )
    
    }
}
interface IHomeState{
    redirect: boolean;
    redirectTo: string;
}