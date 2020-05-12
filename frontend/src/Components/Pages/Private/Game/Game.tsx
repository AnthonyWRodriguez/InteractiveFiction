import React, { Component } from 'react';
import Page from '../../Page';
import { IAuth } from '../../../Common/Interfaces/Interfaces';
import './Game.css';
import { getLocalStorage, saxios } from '../../../Utilities/Utilities';
import { Redirect } from 'react-router-dom';
import Input from '../../../Common/Input/Input';
import { ObjectID } from 'mongodb';

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
            },
            room: {
                roomName: "",
                roomEnter: "",
                roomEnterEnemy: "",
                roomLook: "",
                roomLeft: "",
                roomRight: "",
                roomForward: "",
                roomBackward: "",
                roomObjectsInv: [],
                roomObjectsEnv: [],
                roomEnemy: "",
                roomEnemyHealth: 1,
                roomEnemyAlive: false
            },
            interactables:[]
        }
    }
    static getDerivedStateFromProps = (props:IAuth, state:IGameState)=>{
        if(state.name==="AAAAA"){
            alert("An error has ocurred. Please log in again");
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
                            let aside = document.getElementById("aside") as HTMLElement;
                            aside.scrollTop = aside.scrollHeight;
                            this.setState({
                                room: data
                            });
                        }
                    )
                    .catch(
                        (err)=>{
                            console.log(err);  
                        }
                    )

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
    addAndSetState = () =>{
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
    onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>)=>{
        if(e.keyCode===13){
            this.state.allText.push(this.state.command);
            let lower:string = this.state.command.toLowerCase();
            const words:string[] = lower.split(" ");
            let realWords:string[] = [];
            words.forEach((word)=>{
                if(word!==""){
                    realWords.push(word);
                }
            });

            let objectText:string = "";//for comparing with lower case
            let objectTextUpC:string = "";//for comparing with first letter upper case

            if(realWords.length!==1){
                if(realWords[2]!==undefined){
                    objectText = realWords[1]+" "+realWords[2];
                    objectTextUpC = realWords[1].charAt(0).toUpperCase()+realWords[1].slice(1)+" "+realWords[2].charAt(0).toUpperCase()+realWords[2].slice(1);
                }else{
                    objectText = realWords[1];
                    objectTextUpC = realWords[1].charAt(0).toUpperCase()+realWords[1].slice(1); 
                }        
            }

            if((realWords[0]==="help" || realWords[0]==="hint") && realWords.length===1){
                this.state.allText.push(`Help is on its way. You have variouus ways of interacting with the world around you.
                Just as you just used the verb "help", you can use other verbs to make this world change.
                For instance, if you want to move, you type "move" and a direction. 
                If you want to grab something, type "grab" followd by the object you want to try and grab.
                In the spirit of encouraging exploration, try different verbs and see their effects!`);
            }else if(realWords[0]==="exit"){
                this.state.allText.push(`Your progress is automatically saved every command you make.
                If you want to exit, just press Logout or Adventure at the top of your screen`);
            }
            else if(realWords.length===1){
                this.state.allText.push(`You can't possibly think to "${realWords[0]}" without a something or a somewhere,
                so please, after every verb, please choose an object to interact with`);
            }
            else if(realWords[0]==="move" && realWords.length>2){
                this.state.allText.push(`If you want to move an object, please use pull or push, its more specific`);
            }
            //still missing status, inventory...
            else{
                saxios.get(`api/user/allVerbs`)
                .then(
                    ({data})=>{
                        let allV:IVerbs[] = data;
                        let oneInv:boolean = true;//to see if there was already an inventory item interacted when there are more than 1 in the same room
                        let printed:boolean = false;//to see if the second is a valid object/verb or not
                        for (let c:number=0;c<allV.length;c++){//cycle through each verb to see if the first word is a valid verb
                            if(realWords[0]===allV[c].name){
                                let verbText:string = "object"+allV[c].associateVerb.charAt(0).toUpperCase()+allV[c].associateVerb.slice(1);//the property in each object that will be searched
                                allV.forEach((v) =>{//cycle through each verb to see if the second word is a valid verb
                                    if(objectText===v.name && allV[c].associateVerb==="help"){
                                        this.state.allText.push(v.objectHelp);
                                        this.addAndSetState();
                                        printed=true;
                                    }
                                });
                                for(let a:number = 0;a<this.state.room.roomObjectsEnv.length;a++){
                                    if(this.state.room.roomObjectsEnv[a].objectName === objectTextUpC){
                                        for(let b:number = 0;b<(Object.entries(this.state.room.roomObjectsEnv[a])).length;b++){
                                            if((Object.entries(this.state.room.roomObjectsEnv[a]))[b][0]===verbText){
                                                this.state.allText.push((Object.entries(this.state.room.roomObjectsEnv[a]))[b][1] as string);
                                                this.addAndSetState();
                                                printed=true;
                                                break;
                                            }     
                                        }
                                        if(!printed){
                                            break;
                                        }
                                    }
                                }
                                for(let a:number = 0;a<this.state.room.roomObjectsInv.length;a++){
                                    if(this.state.room.roomObjectsInv[a].objectName === objectTextUpC){
                                        for(let b:number = 0;b<(Object.entries(this.state.room.roomObjectsInv[a])).length;b++){
                                            if((Object.entries(this.state.room.roomObjectsInv[a]))[b][0]===verbText){
                                                if(oneInv){
                                                    this.state.allText.push((Object.entries(this.state.room.roomObjectsInv[a]))[b][1] as string);
                                                    this.addAndSetState();
                                                    printed=true;
                                                    break;    
                                                }
                                            }     
                                        }
                                        if(!printed){
                                            break;
                                        }
                                    }
                                }
                                for(let a:number=0;a<this.state.user.userInventory.length;a++){
                                    if(this.state.user.userInventory[a].objectName === objectTextUpC){
                                        for(let b:number = 0;b<(Object.entries(this.state.user.userInventory[a])).length;b++){
                                            if(Object.entries(this.state.user.userInventory[a])[b][0]===verbText){
                                                if(oneInv){
                                                    this.state.allText.push(Object.entries(this.state.user.userInventory[a])[b][1] as string);
                                                    this.addAndSetState();
                                                    printed=true;
                                                    break;    
                                                }
                                            }
                                        }
                                        if(!printed){
                                            break;
                                        }
                                    }
                                }
                            }
                        };
                        if(!printed){
                            this.state.allText.push(`You can't possibly think to "${realWords[0]}" ${objectTextUpC}`);
                            this.addAndSetState();
                        }
                    }
                )
                .catch(
                    (err)=>{
                        console.log(err);
                    }
                )
            }
            this.addAndSetState();
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
    user: IUser;
    room: IRoom;
    interactables: string[];
}
interface IUser{
    _id: string;
    userCurrentRoom: string;
    userInventory: any[];
    userLeftEquip: string;
    userRightEquip: string;
}
interface IRoom{
    roomName: string;
    roomEnter: string;
    roomEnterEnemy: string;
    roomLook: string;
    roomLeft: ObjectID|string;
    roomRight: ObjectID|string;
    roomForward: ObjectID|string;
    roomBackward: ObjectID|string;
    roomObjectsInv: any[]
    roomObjectsEnv: any[]
    roomEnemy: string;
    roomEnemyHealth: number;
    roomEnemyAlive: boolean;
}
interface IVerbs{
    name: string;
    objectHelp: string;
    associateVerb: string;
}
