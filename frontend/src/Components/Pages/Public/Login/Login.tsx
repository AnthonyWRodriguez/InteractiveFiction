import React, {Component} from 'react';
import Page from '../../Page';
import 'bootstrap/dist/css/bootstrap.css';
import {emailRegex, emptyRegex, badEmail} from '../../../Common/Validators/Validators';
import Input from '../../../Common/Input/Input';
import { naxios, removeLocalStorage, setLocalStorage} from '../../../Utilities/Utilities';
import { IAuth } from '../../../Common/Interfaces/Interfaces';
import { Redirect } from 'react-router-dom';

export default class Login extends Component<IAuth, ILoginState>{
    constructor(props: IAuth){
        super(props);
        this.state={
            email:'',
            emailError: [],
            redirect: false,
            redirectTo: '',
        }
    }
    validate = (val:string)=>{
        let nameErrors:object = {};
        let tmpErrors:string[] = [];
        const email:string = val;
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
        let errors:object = this.validate(value);
        let str:string = "emailError";
        if(this.state.emailError.length){
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
        let value = this.state.email;
        let errors:object = this.validate(value);
        if(this.state.emailError.length || value===''){
            this.setState({...this.state, ...errors});
        }else{
            if(
                badEmail.test(this.state.email)||
                this.state.email === "test@test.test"||
                this.state.email === "test@test.com"||
                this.state.email === "demo@demo.demo"||
                this.state.email === "demo@demo.com"
                
            ){
                alert("Please use a reasonable email address")
            }
            else if(this.state.email === "easter@egg.com"){
                alert("Easter Egg found! Congratulations!");
            }else{
                const email = this.state.email;
                naxios.get(
                    `/api/user/myUser/${email}`
                )
                .then(
                    ({data})=>{
                        if(data===null || data ===undefined){
                            alert("The user doesn't exist. Redirecting toward creating a new user");
                            this.setState({
                                ...this.state,
                                redirect: true,
                                redirectTo: '/new'
                            },()=>{
                                setLocalStorage("potentialEmail",this.state.email);
                            })
                        }else if(!data.userActive){
                            alert("Your user has been deactivated. Have a great day");
                        }
                        else{
                            if(this.props.login){
                                this.props.login(data.userName, data.userEmail);
                                this.setState({
                                    ...this.state,
                                    redirect: true,
                                    redirectTo: '/'
                                })    
                            }
                        }
                    }
                )
                .catch(
                    (err)=>{
                        console.log(err); 
                    }
                )
            }
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
                    <Input 
                        type="text" 
                        className="form-control bg-transparent text-white" 
                        caption="Email"
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

interface ILoginState{
    email: string;
    emailError: string[];
    redirect: boolean;
    redirectTo: string;
}
