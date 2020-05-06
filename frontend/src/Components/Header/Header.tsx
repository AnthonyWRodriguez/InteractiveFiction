import React, {Component} from 'react';
import { Link } from 'react-router-dom'; 
import { IoIosLogIn } from 'react-icons/io'
import 'bootstrap/dist/css/bootstrap.css';

export default class Header extends Component<IHeaderProps, IHeaderState>{
    constructor(props: IHeaderProps){
        super(props);
    }
    render(){
        return(
            <header className="d-flex bg-dark align-items-center">
                <Link to="/" className="col-sm-11 p-2 text-danger"><h1 >Adventure!</h1></Link>
                <Link to="/login" className="col-sm-1 align-items-ccenter"><h4>Login<IoIosLogIn/></h4></Link>
            </header>
        )
    }
}
interface IHeaderProps{

}

interface IHeaderState{

}
