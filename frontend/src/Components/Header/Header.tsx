import React, {Component} from 'react';
import { Link } from 'react-router-dom'; 
import { IoIosLogIn, IoIosLogOut } from 'react-icons/io'
import 'bootstrap/dist/css/bootstrap.css';
import { IAuth } from '../Common/Interfaces/Interfaces';

export default class Header extends Component<IAuth, IHeaderState>{
    constructor(props: IAuth){
        super(props);
    }
    render(){
        if(this.props.auth.name===""){
            return(
                <header className="d-flex bg-dark align-items-center">
                    <Link to="/" className="col-sm-11 p-2 text-danger"><h1 >Adventure!</h1></Link>
                    <Link to="/login" className="col-sm-1 align-items-ccenter"><h4>Login<IoIosLogIn/></h4></Link>
                </header>
            )                
        }else{
            return(
                <header className="d-flex bg-dark align-items-center">
                    <Link to="/" className="col-sm-11 p-2 text-danger"><h1 >Adventure!</h1></Link>
                    <Link to="/login" className="col-sm-1 align-items-ccenter"><h4>Logout<IoIosLogOut/></h4></Link>
                </header>
            )                
        }
    }
}

interface IHeaderState{

}
