import React, { Component } from 'react';
import Page from '../../Page';
import { IAuth } from '../../../Common/Interfaces/Interfaces';

export default class Game extends Component<IAuth, IGameState>{
    constructor(props: IAuth){
        super(props);
    }
    render(){
        return(
            <Page auth={this.props.auth}>
                
            </Page>
        )
    }
}
interface IGameState{

}