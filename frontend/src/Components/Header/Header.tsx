import React, {Component} from 'react';

export default class Header extends Component<IHeaderProps, IHeaderState>{
    constructor(props: IHeaderProps){
        super(props);
    }
    render(){
        return(
            <header>
                <h1>THIS HEADER IS IMPORTANT</h1>
            </header>
        )
    }
}
interface IHeaderProps{

}

interface IHeaderState{

}
