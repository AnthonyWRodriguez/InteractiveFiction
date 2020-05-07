import React, { Component } from 'react';
import Page from '../../Page';
import Input from '../../../Common/Input/Input';
import 'bootstrap/dist/css/bootstrap.css';
import { IAuth } from '../../../Common/Interfaces/Interfaces';

export default class New extends Component<IAuth, INewState>{
    constructor(props:IAuth){
        super(props);
        this.state={
            name: ''
        }
    }
    onChangeText = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const value = e.currentTarget.value;
        this.setState({
            ...this.state,
            "name": value,
        },()=>{
            console.log(this.state);
            console.log(this.props.auth.email);
        });
    }
    onClickBtn=(e:React.MouseEvent<HTMLButtonElement>)=>{

    }
    render(){
        return(
            <Page auth={this.props.auth}>
                <div className="container">
                    <Input
                        type="text" 
                        className="form-control bg-transparent text-white" 
                        caption="Name"
                        placeholder="Enter your character's name"
                        name="name"               
                        value={this.state.name}
                        onChange={this.onChangeText}
                    >
                    </Input>
                    <button 
                        className="col-sm-12 btn-secondary" 
                        onClick={this.onClickBtn}
                    >
                        Log In
                    </button>
                </div>
            </Page>
        )
    }
}
interface INewState{
    name: string;
}
