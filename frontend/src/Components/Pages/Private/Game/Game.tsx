import React, { Component } from 'react';
import Page from '../../Page';
import { IAuth } from '../../../Common/Interfaces/Interfaces';
import './Game.css';
import { getLocalStorage, saxios } from '../../../Utilities/Utilities';
import { Redirect } from 'react-router-dom';
import Input from '../../../Common/Input/Input';
import { helpRegex, exitRegex } from '../../../Common/Validators/Validators';

export default class Game extends Component<IAuth, IGameState>{
    constructor(props: IAuth){
        super(props);
        this.state={
            command: "",
            name: (getLocalStorage("name")||"AAAAA"),
            allText: [],
            user: {
                _id:"",
                userCurrentRoom: "",
                userInventory: [],
                userLeftEquip: "",
                userRightEquip: ""
            }
        }
    }
    static getDerivedStateFromProps = (props:IAuth, state:IGameState)=>{
        if(state.name==="AAAAA"){
            alert("An error has ocurred. Please login again");
            return(<Redirect to="/login"/>);
        }

        return null;    
    }
    componentDidMount(){
        let email:string|null = (getLocalStorage("email")||"AAAAA");
        saxios.get(
            `/api/user/myUser/${email}`
        )
        .then(
            ({data})=>{
                this.setState({
                    user: data,
                    allText: data.userCommands
                },()=>{
                    saxios.get(`/api/user/currentRoom/${this.state.user._id}/${this.state.user.userCurrentRoom}`)
                    .then(
                        ({data})=>{
                            console.log(data);
                        }
                    )
                    .catch(
                        (err)=>{
                            console.log(data);  
                        }
                    )
                    let aside = document.getElementById("aside") as HTMLElement;
                    aside.scrollTop = aside.scrollHeight;
                })
            }
        )
        .catch(
            (err)=>{
                console.log(err);
            }
        )
    }
    onChangeText = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const {name, value} = e.currentTarget;
        this.setState({
            ...this.state,
            [name]:value,
        });
    }
    onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>)=>{
        if(e.keyCode===13){
            console.log(this.state.allText);
            this.state.allText.push(this.state.command);
            let lower:string = this.state.command.toLowerCase();
            if(helpRegex.test(lower)){
                this.state.allText.push(`Help is on its way. You have variouus ways of interacting with the world around you.
                Just as you just used the verb "help", you can use other verbs to make this world change.
                For instance, if you want to move, you type "move" and a direction. 
                If you want to grab something, type "grab" followd by the object you want to try and grab.
                In the spirit of encouraging exploration, try different verbs and see their effects!`);
            }else if(exitRegex.test(lower)){
                this.state.allText.push(`Your progress is automatically saved every command you make.
                If you want to exit, just press Logout or Adventure at the top of your screen`);
            }
            else{
                const words:string[] = lower.split(" ");
                let realWords:string[] = [];
                words.forEach((word)=>{
                    if(word!==""){
                        realWords.push(word);
                    }
                });
                console.log(realWords);
                saxios.get(`api/user/allVerbs`)
                .then(
                    ({data})=>{
                        let allV:IVerbs[] = data;
                        allV.forEach((verb) => {
                            console.log(verb.name);
                        });
                    }
                )
                .catch(
                    (err)=>{
                        console.log(err);
                    }
                )
            }
            let emailS:string|null = (getLocalStorage("email")||"AAAAA");
            saxios.put(
                `/api/user/addCommand`,
                {
                    email: emailS,
                    commands: this.state.allText
                }
            )
            this.setState({
                command: ""
            },()=>{
                let aside = document.getElementById("aside") as HTMLElement;
                aside.scrollTop = aside.scrollHeight;
            });
        }
    }
    render(){
        let num=0;
        let uiItems:object;
        if(this.state.allText!==null){
            uiItems = this.state.allText.map(
                (item)=>{
                    num++;
                    return(
                        <p key={num}>{item}</p>
                    )
                }
            );    
        }else{
            uiItems = <p key="0">Empty</p>
        }
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
                            keyDown={this.onKeyPress}
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
    user: {
        _id: string;
        userCurrentRoom: string;
        userInventory: string[];
        userLeftEquip: string;
        userRightEquip: string;
    };
}
interface IVerbs{
    name: string;
    help: string;
    associateVerb: string;
}