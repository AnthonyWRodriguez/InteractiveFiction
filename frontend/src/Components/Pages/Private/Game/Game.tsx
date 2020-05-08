import React, { Component } from 'react';
import Page from '../../Page';
import { IAuth } from '../../../Common/Interfaces/Interfaces';
import './Game.css';
import { getLocalStorage } from '../../../Utilities/Utilities';
import { Redirect } from 'react-router-dom';
import Input from '../../../Common/Input/Input';

export default class Game extends Component<IAuth, IGameState>{
    constructor(props: IAuth){
        super(props);
        this.state={
            command: "",
            name: (getLocalStorage("name")||"AAAAA"),
            allText: []
        }
    }
    static getDerivedStateFromProps = (props:IAuth, state:IGameState)=>{
        if(state.name==="AAAAA"){
            alert("An error has ocurred. Please login again");
            return(<Redirect to="/login"/>);
        }
        if(!state.allText.length){
            state.allText.push(
                `You start at the doors of a massive castle. 
                You look at your surroundings: A wide open space. 
                This castle has been constructed atop a cliff with no apparent way to enter or leave. 
                A maiden's shouts can be faintly heard inside. 
                You hear your name being called out.`,
                `${state.name}!!! Save me!!!`,
                `You try to force the door open, but it appears to be locked. 
                The path behind you is gone beacuse the wooden bridge collapsed. 
                You can go around the castle through the left or the right. `,
                `As you start to feel you gain control over your whole body after daydreaming about
                ... well... that's not important..., but after you regain body control, 
                you hear a strange voice saying "Welcome to my world, dear player."`,
                `"I'm the inner voice of your conscience. 
                During this adventure you're about to embark, 
                I will be the one in charge of guiding you. 
                In case you need any help, you may type in 'help'"`,
            )
            return null;
        }
        return null;
    }
    componentDidMount(){
        let aside = document.getElementById("aside") as HTMLElement;
        aside.scrollTop = aside.scrollHeight;
    }
    onChangeText = (e: React.ChangeEvent<HTMLInputElement>)=>{
        console.log("THIS WORKS!!!");
    }
    render(){
        let num=0;
        const uiItems:object = this.state.allText.map(
            (item)=>{
                num++;
                return(
                    <p key={num}>{item}</p>
                )
            }
        );
        return(
                <Page auth={this.props.auth}>
                    <div className="container d-flex flex-column align-items-center justify-content-center">
                        <aside 
                            className="bg-secondary"
                            id="aside"
                        >
                            {uiItems}
                        </aside>
                        &nbsp;
                        <Input
                            type="text" 
                            className="form-control bg-transparent text-white" 
                            placeholder="Enter your command"
                            name="command"
                            value={this.state.command}
                            onChange={this.onChangeText}
                        ></Input>
                    </div>
                </Page>
        )
    }
}
interface IGameState{
    command: string;
    name: string|null;
    allText: string[];
}