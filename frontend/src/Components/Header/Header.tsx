import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';

export default class Header extends Component<IHeaderProps, IHeaderState>{
    constructor(props: IHeaderProps){
        super(props);
    }
    render(){
        return(
            <header className="d-flex bg-dark">
                <h1 className="col-sm-12 p-2 text-danger">Adventure!</h1>

            </header>
        )
    }
}
interface IHeaderProps{

}

interface IHeaderState{

}
