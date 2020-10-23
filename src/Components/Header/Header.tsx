import React, {Component} from 'react';
import { Link } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.css';
import AuthenticationButton from '../Common/Buttons/authentication-button';


export default ()=>{
    return(
        <header className="d-flex bg-dark align-items-center">
            <Link to="/" className="col-sm-10 p-2 text-danger"><h1 >Adventure!</h1></Link>
            <AuthenticationButton/>
        </header>
    )
}
/*export default class Header extends Component<IHeaderState>{
    render(){
        return(
            <header className="d-flex bg-dark align-items-center">
                <Link to="/" className="col-sm-10 p-2 text-danger"><h1 >Adventure!</h1></Link>
                <AuthenticationButton/>
            </header>
        )                
    }
}

interface IHeaderState{

}*/
