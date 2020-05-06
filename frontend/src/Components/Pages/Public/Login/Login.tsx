import React, {Component} from 'react';
import Page from '../../Page';
import 'bootstrap/dist/css/bootstrap.css';
import {emailRegex, emptyRegex, badEmail} from '../../../Common/Validators/Validators';
import Input from '../../../Common/Input/Input';
import { naxios} from '../../../Utilities/Utilities';

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
        let name = "email";
        let value = this.state.email;
        let errors:object = this.validate([name, value]);
        if(this.state.emailError.length){
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
                        if(data===null){
                            alert("El usuario no existe. Redirigiendo a crear usuario");
                        }else{
                            alert("Si existe el usuario");
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
        return(
            <Page>
                <div className="container">
                    <Input 
                        type="text" 
                        className="form-control bg-transparent text-white" 
                        caption="Email"
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
