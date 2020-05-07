import React, { Component } from 'react';
import Page from '../../Page';
import Input from '../../../Common/Input/Input';
import 'bootstrap/dist/css/bootstrap.css';
import { IAuth } from '../../../Common/Interfaces/Interfaces';
import { getLocalStorage, naxios } from '../../../Utilities/Utilities';
import { Redirect } from 'react-router-dom';
import { badNames, emptyRegex } from '../../../Common/Validators/Validators';

export default class New extends Component<IAuth, INewState>{
    constructor(props:IAuth){
        super(props);
        this.state={
            name: '',
            nameError: [],
            redirect: false,
            redirectTo: '/'
        }
    }
    validate = (val:string)=>{
        let nameErrors:object = {};
        let tmpErrors:string[] = [];
        const name:string = val;
        if(name !== undefined){
            if((!(badNames.test(name)))||(emptyRegex.test(name))||name.length<=1){
                tmpErrors.push("Please type a real name longer than a letter");
            }
            nameErrors = Object.assign({}, nameErrors,  {nameError: tmpErrors});
        }
        return nameErrors;
    }
    onChangeText = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value} = e.currentTarget;
        let errors:object = this.validate(value);
        console.log(this.state);
        this.setState({
            ...this.state,
            [name]:value,
            ...errors
        });
    }
    onClickBtn=(e:React.MouseEvent<HTMLButtonElement>)=>{
        const name = this.state.name;
        let errors:object = this.validate(name);
        if(this.state.nameError.length || name===''){
            alert("Please type a real name longer than a letter");
            this.setState({...this.state, ...errors});
        }else if(getLocalStorage("potentialEmail")){
            const email:string|null = getLocalStorage("potentialEmail");
            naxios.get(
                `/api/user/myUser/${email}`
            )
            .then(
                ({data})=>{
                    if(data){
                        alert("A user already exists with that email. Please don't tamper with the settings");
                    }else{
                        naxios.post(
                            `api/user/new`,
                            {
                                name: this.state.name,
                                email: email
                            }
                        )
                        .then(
                            ({data})=>{
                                alert("Your character has been created. Let's start this story...");
                                this.setState({
                                    redirect: true,
                                    redirectTo: '/game'
                                })
                            }
                        )
                        .catch(
                            (err)=>{
                                console.log(err);
                            }
                        )
                    }
                }
            )
            .catch(
                (err)=>{
                    console.log(err);
                }
            )
        }else{
            alert("You got no email address for your new character... Redirecting to assignin one");
            this.setState({
                redirect: true,
                redirectTo: "/login"
            });
        }
    }
    render(){
        if(this.state.redirect){
            const dir:string = (this.state.redirectTo||'/');
            return (<Redirect to={dir} />);
        }
        return(
            <Page auth={this.props.auth}>
                <div className="container">
                    <Input
                        type="text" 
                        className="form-control bg-transparent text-white" 
                        caption="Name"
                        placeholder="Enter your character's name"
                        name="name"
                        error={this.state.nameError}              
                        value={this.state.name}
                        onChange={this.onChangeText}
                    >
                    </Input>
                    <button 
                        className="col-sm-12 btn-secondary" 
                        onClick={this.onClickBtn}
                    >
                        Start Game!
                    </button>
                </div>
            </Page>
        )
    }
}
interface INewState{
    name: string;
    nameError: string[];
    redirect: boolean;
    redirectTo: string;
}
