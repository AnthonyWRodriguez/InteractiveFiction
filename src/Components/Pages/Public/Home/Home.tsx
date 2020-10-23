import React, {Component} from 'react';
import Page from '../../Page';
import 'bootstrap/dist/css/bootstrap.css';
import { setLocalStorage } from '../../../Utilities/Utilities';
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";

const Home = () => {

    const { user } = useAuth0();
    const history = useHistory();
  
    return(
        <Page>
            <div className="container">
                <button 
                    className="btn btn-danger col-sm-12"
                    onClick={()=>{
                        if(user?.email && user?.name){
                            setLocalStorage('name', user.name);
                            setLocalStorage('email', user.email);
                            alert(`Welcome to your adventure ${user.name}`);
                            history.push("/game");
                        }else{
                            alert("Please login to start your adventure");
                        }
                    }}
                >
                    PLAY
                </button>
            </div>
        </Page>
    )
};
  
export default Home;
/*
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
        const { user } = useAuth0();
        const { name, picture, email } = user;
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
}*/