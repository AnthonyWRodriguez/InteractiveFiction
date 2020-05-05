import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';

export default class Header extends Component<IHeaderProps, IHeaderState>{
    constructor(props: IHeaderProps){
        super(props);
    }
    render(){
        return(
            <header>
                <h1 className="col-sm-12 p-2 bg-dark text-danger">Adventure!</h1>
            </header>
        )
    }
}
interface IHeaderProps{

}

interface IHeaderState{

}
