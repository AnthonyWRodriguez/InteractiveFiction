import React, { Component } from 'react';
import Page from '../../Page';
import { IAuth } from '../../../Common/Interfaces/Interfaces';
import './Game.css';
import { getLocalStorage, saxios } from '../../../Utilities/Utilities';
import { Redirect } from 'react-router-dom';
import Input from '../../../Common/Input/Input';
import { ObjectID } from 'mongodb';
import { IoIosReturnLeft } from 'react-icons/io';

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
                userLeftEquip: {
                    objectName: "",
                    objectType: "",
                    objectValue: 0,
                    objectWeight: 0
                },
                userRightEquip: {
                    objectName: "",
                    objectType: "",
                    objectValue: 0,
                    objectWeight: 0
                },
                userBaseHealth:0,
                userRealHealth:0,
                userAtk:0
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
                    if(this.state.user.userRealHealth===0){
                        alert("You died. Restarting from the beginning...");
                        saxios.put(
                            `/api/user/death`,
                            {
                                name: this.state.name
                            }
                        )
                        .then(
                            ({data})=>{
                                alert(data.msg);
                            }
                        )
                        .catch(
                            (err)=>{
                                console.log(err);
                            }
                        )
                    }else{
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
                    }
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
    mainGameCode = ()=>{
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

        //Special case for Equip and Unequip
        var direction = "";
        var errorEquipUnequip=false;
        if(realWords[0]==="equip"){
            if(realWords.length===4){
                if(realWords[1]==="left" || realWords[1]==="left-hand"){  
                    direction="left";
                    objectText = realWords[2]+" "+realWords[3];
                    objectTextUpC = realWords[2].charAt(0).toUpperCase()+realWords[2].slice(1)+" "+realWords[3].charAt(0).toUpperCase()+realWords[3].slice(1);
                }
                if(realWords[1]==="right" || realWords[1]==="right-hand"){
                    direction="right";
                    objectText = realWords[2]+" "+realWords[3];
                    objectTextUpC = realWords[2].charAt(0).toUpperCase()+realWords[2].slice(1)+" "+realWords[3].charAt(0).toUpperCase()+realWords[3].slice(1);
                }
                if(realWords[3]==="left" || realWords[3]==="left-hand"){ 
                    direction="left";
                }
                if(realWords[3]==="right" || realWords[3]==="right-hand"){
                    direction="right";
                }
            }else if(realWords.length===5){
                if(realWords[1]==="left" && realWords[2]==="hand"){ 
                    direction="left";
                    objectText = realWords[3]+" "+realWords[4];
                    objectTextUpC = realWords[3].charAt(0).toUpperCase()+realWords[3].slice(1)+" "+realWords[4].charAt(0).toUpperCase()+realWords[4].slice(1);
                }
                if(realWords[1]==="right" && realWords[2]==="hand"){
                    direction="right";
                    objectText = realWords[3]+" "+realWords[4];
                    objectTextUpC = realWords[3].charAt(0).toUpperCase()+realWords[3].slice(1)+" "+realWords[4].charAt(0).toUpperCase()+realWords[4].slice(1);
                }
                if(realWords[3]==="left" && realWords[4]==="hand"){ 
                    direction="left";
                }
                if(realWords[3]==="right" && realWords[4]==="hand"){
                    direction="right";
                }
            }else{
                this.state.allText.push(`The correct way to equip an object is:
                "equip" followed by the object and finally the direction of the hand you want to equip it (left or right)`);
                errorEquipUnequip=true;
            }
        }
        if(realWords[0]==="unequip"){
            if(realWords.length===2){
                if(realWords[1]==="left" || realWords[1]==="left-hand"){
                    direction="left"; 
                }
                if(realWords[1]==="right" || realWords[1]==="right-hand"){
                    direction="right"; 
                }
            }else if(realWords.length===3){
                if(realWords[1]==="left" && realWords[2]==="hand"){
                    direction="left";
                    objectText="";
                    objectTextUpC="";
                }
                if(realWords[1]==="right" && realWords[2]==="hand"){
                    direction="right";
                    objectText="";
                    objectTextUpC="";
                }
            }else if(realWords.length===4){
                if(realWords[1]==="left" || realWords[1]==="left-hand"){ 
                    direction="left";
                    objectText = realWords[2]+" "+realWords[3];
                    objectTextUpC = realWords[2].charAt(0).toUpperCase()+realWords[2].slice(1)+" "+realWords[3].charAt(0).toUpperCase()+realWords[3].slice(1);
                }
                if(realWords[1]==="right" || realWords[1]==="right-hand"){ 
                    direction="right";
                    objectText = realWords[2]+" "+realWords[3];
                    objectTextUpC = realWords[2].charAt(0).toUpperCase()+realWords[2].slice(1)+" "+realWords[3].charAt(0).toUpperCase()+realWords[3].slice(1);
                }
                if(realWords[3]==="left" || realWords[3]==="left-hand"){
                    direction="left";
                }
                if(realWords[3]==="right" || realWords[3]==="right-hand"){
                    direction="right";
                }
            }else if(realWords.length===5){
                if(realWords[1]==="left" && realWords[2]==="hand"){ 
                    direction="left";
                    objectText = realWords[3]+" "+realWords[4];
                    objectTextUpC = realWords[3].charAt(0).toUpperCase()+realWords[3].slice(1)+" "+realWords[4].charAt(0).toUpperCase()+realWords[4].slice(1);
                }
                if(realWords[1]==="right" && realWords[2]==="hand"){ 
                    direction="right";
                    objectText = realWords[3]+" "+realWords[4];
                    objectTextUpC = realWords[3].charAt(0).toUpperCase()+realWords[3].slice(1)+" "+realWords[4].charAt(0).toUpperCase()+realWords[4].slice(1);
                }
                if(realWords[3]==="left" && realWords[4]==="hand"){
                    direction="left";
                }
                if(realWords[3]==="right" && realWords[4]==="hand"){
                    direction="right"
                }
            }else{
                this.state.allText.push(`The correct way to unequip an object is:
                "unequip" followed by the object and finally the direction of the hand you want to unequip it (left or right)`);
                errorEquipUnequip=true;
            }
        }
        //End special case

        if((realWords[0]==="help" || realWords[0]==="hint") && realWords.length===1){
            this.state.allText.push(`Help is on its way. You have variouus ways of interacting with the world around you.
            Just as you just used the verb "help", you can use other verbs to make this world change.
            For instance, if you want to move, you type "move" and a direction. 
            If you want to grab something, type "grab" followed by the object you want to try and grab.
            In the spirit of encouraging exploration, try different verbs and see their effects!`);
        }else if(realWords[0]==="exit"){
            this.state.allText.push(`Your progress is automatically saved every command you make.
            If you want to exit, just press Logout or Adventure at the top of your screen`);
        }
        else if(realWords[0]==="inventory"){
            let uInv:string[] = [];
            for(let a=0;a<this.state.user.userInventory.length;a++){
                uInv.push(this.state.user.userInventory[a].objectName);
            }
            this.state.allText.push(`Your current inventory is: ${uInv}`);
        }
        else if(realWords[0]==="status"){
            this.state.allText.push(`Your current health is: ${this.state.user.userRealHealth}/${this.state.user.userBaseHealth}.
            In your left hand a(an): ${this.state.user.userLeftEquip.objectName}. In your right hand you have a(an): ${this.state.user.userRightEquip.objectName}`);
        }
        else if(realWords.length===1){
            this.state.allText.push(`You can't possibly think to "${realWords[0]}" without a something or a somewhere,
            so please, after every verb, please choose an object to interact with`);
        }
        else if(realWords[0]==="move" && realWords.length>2){
            this.state.allText.push(`If you want to move an object, please use pull or push, its more specific`);
        }
        else{
            if(!errorEquipUnequip){
                saxios.get(`api/user/allVerbs`)
                .then(
                    ({data})=>{
                        let allV:IVerbs[] = data;
                        let oneInv:boolean = true;//to see if there was already an inventory item interacted when there are more than 1 in the same room
                        let printed:boolean = false;//to see if it has already printed something or not
                        for (let c:number=0;c<allV.length;c++){//cycle through each verb to see if the first word is a valid verb
                            if(realWords[0]===allV[c].name){
                                let verbText:string = "object"+allV[c].associateVerb.charAt(0).toUpperCase()+allV[c].associateVerb.slice(1);//the property in each object that will be searched
                                for (let d:number=0;d<allV.length;d++){//cycle through each verb to see if the second word is a valid verb
                                    if(objectText===allV[d].name && allV[c].associateVerb==="help"){
                                        this.state.allText.push(allV[d].objectHelp);
                                        this.addAndSetState();
                                        printed=true;
                                    }
                                }
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
                                        if(printed){
                                            break;
                                        }
                                    }
                                }
                                if(verbText!=="objectDrop" && verbText!=="objectEquip" && verbText!=="objectUnequip"){
                                    for(let a:number = 0;a<this.state.room.roomObjectsInv.length;a++){
                                        if(this.state.room.roomObjectsInv[a].objectName === objectTextUpC){
                                            for(let b:number = 0;b<(Object.entries(this.state.room.roomObjectsInv[a])).length;b++){
                                                if((Object.entries(this.state.room.roomObjectsInv[a]))[b][0]===verbText){
                                                    if(oneInv){
                                                        oneInv=false;
                                                        let uri = ``;
                                                        if(verbText==="objectGrab"){
                                                            uri = `/api/user/grab`;
                                                            saxios.put(
                                                                `${uri}`,
                                                                {
                                                                    object: this.state.room.roomObjectsInv[a],
                                                                    currentRName: this.state.room.roomName,
                                                                    uName: this.state.name,
                                                                    InvObjs: this.state.room.roomObjectsInv
                                                                }
                                                            )
                                                            .then(
                                                                ({data})=>{
                                                                    this.componentDidMount();
                                                                }
                                                            )
                                                            .catch(
                                                                (err)=>{
                                                                    console.log(err);
                                                                }
                                                            )
                                                        }
                                                    }
                                                    this.state.allText.push((Object.entries(this.state.room.roomObjectsInv[a]))[b][1] as string);
                                                    this.addAndSetState();
                                                    printed=true;
                                                    break;    
                                                }     
                                            }
                                        }
                                    }
                                    if(!printed){
                                        this.state.allText.push(`There is no ${objectTextUpC} in this room`);
                                        this.addAndSetState();
                                        printed=true;
                                    }
                                }
                                if(verbText!=="objectGrab"){
                                    for(let a:number=0;a<this.state.user.userInventory.length;a++){
                                        if(this.state.user.userInventory[a].objectName === objectTextUpC){
                                            for(let b:number = 0;b<(Object.entries(this.state.user.userInventory[a])).length;b++){
                                                if(Object.entries(this.state.user.userInventory[a])[b][0]===verbText){
                                                    if(oneInv){
                                                        oneInv=false;
                                                        let obj=this.state.user.userInventory[a]
                                                        let uri = ``;
                                                        if(verbText==="objectDrop"){
                                                            uri = `/api/user/drop`;
                                                        }
                                                        if(verbText==="objectEquip"){
                                                            uri=`/api/user/equip`
                                                        }
                                                        if(verbText==="objectUnequip"){
                                                            uri=`/api/user/unequip`;
                                                            obj=objectTextUpC;
                                                        }
                                                        if(uri!==``){
                                                            console.log(obj);
                                                            saxios.put(
                                                                `${uri}`,
                                                                {
                                                                    object: obj,
                                                                    currentRName: this.state.room.roomName,
                                                                    uName: this.state.name,
                                                                    InvObjs: this.state.user.userInventory,
                                                                    leftE: this.state.user.userLeftEquip.objectName,
                                                                    rightE: this.state.user.userRightEquip.objectName,
                                                                    dir: direction,
                                                                }
                                                            )
                                                            .then(
                                                                ({data})=>{
                                                                    if(data.msg){
                                                                        this.state.allText.push(data.msg);
                                                                        this.addAndSetState();
                                                                        this.componentDidMount();   
                                                                        printed=true; 
                                                                    }
                                                                    this.componentDidMount();   
                                                                }
                                                            )
                                                            .catch(
                                                                (err)=>{
                                                                    console.log(err);
                                                                }
                                                            )    
                                                        }
                                                        if(!printed){
                                                            this.state.allText.push((Object.entries(this.state.user.userInventory[a])[b][1] as string));
                                                            this.addAndSetState();
                                                            printed=true;
                                                            break;        
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if(!printed){
                                        this.state.allText.push(`You have no ${objectTextUpC} in your inventory`);
                                        this.addAndSetState();
                                        printed=true;
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
        }
        this.addAndSetState();
    }
    onClickBtn = (e: React.MouseEvent<HTMLButtonElement>)=>{
        if(this.state.command!==""){
            this.mainGameCode();
        }
    }
    onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>)=>{
        if(e.keyCode===13){
            if(this.state.command!==""){
                this.mainGameCode();
            }
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
                    <div className="container d-flex flex-row">
                        <Input
                            type="text" 
                            className="form-control bg-transparent text-white" 
                            placeholder="Enter your command"
                            name="command"
                            value={this.state.command}
                            onChange={this.onChangeText}
                            keyDown={this.onKeyPress}
                        ></Input>
                        <button className="btn btn-success" onClick={this.onClickBtn}><IoIosReturnLeft/></button>
                    </div>
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
    userLeftEquip: IEquip;
    userRightEquip: IEquip;
    userBaseHealth: number;
    userRealHealth: number;
    userAtk: number;
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
interface IEquip{
    objectName: string;
    objectType: string;
    objectValue: number;
    objectWeight: number;
}