import React, {Component} from 'react';
import Page from '../../Page';
import 'bootstrap/dist/css/bootstrap.css';
import {emailRegex, emptyRegex} from '../../../Common/Validators/Validators';
import Input from '../../../Common/Input/Input';

export default class Header extends Component<IHeaderProps, IHeaderState>{
    constructor(props: IHeaderProps){
        super(props);
        this.state={
            email:'',
            emailError: []
        }
    }
    validate = (state: [string, string])=>{
        let nameErrors:object = {};
        let tmpErrors:string[] = [];
        const email:string = state[1];
        if(email !== undefined){
            if((!(emailRegex.test(email)))||(emptyRegex.test(email))){
                tmpErrors.push("Please type an email with a correct format");
            }
            nameErrors = Object.assign({}, nameErrors,  {emailError: tmpErrors});
        }

        return nameErrors;
    }
    onChangeText = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const {name, value} = e.currentTarget;
        let errors:object = this.validate([name, value]);
        let str:string = name+"Error";
        if(errors==={str: {}}){
            this.setState({
                ...this.state,
                [name]:value,
                [str]:''
            });
        }
        this.setState({
            ...this.state,
            [name]:value,
            ...errors
        });
    }
    onClickBtn = (e: React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        e.stopPropagation();

    }
    render(){
        return(
            <Page>
                <div className="container">
                    <Input 
                        type="text" 
                        className="form-control bg-transparent text-white" 
                        caption=""
                        aria-label="Default" 
                        aria-describedby="inputGroup-sizing-default"
                        placeholder="Enter your email"
                        name="email"
                        error={this.state.emailError}                        
                        value={this.state.email}
                        onChange={this.onChangeText}
                    />
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
interface IHeaderProps{

}

interface IHeaderState{
    email: string;
    emailError: string[];
}
