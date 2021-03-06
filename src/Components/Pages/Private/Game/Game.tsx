import React, { Component } from 'react';
import Page from '../../Page';
import { IAuth } from '../../../Common/Interfaces/Interfaces';
import './Game.css';
import { getLocalStorage, saxios, naxios } from '../../../Utilities/Utilities';
import { Redirect } from 'react-router-dom';
import Input from '../../../Common/Input/Input';
import { ObjectID } from 'mongodb';
import { IoIosReturnLeft } from 'react-icons/io';
import { allMoves } from '../../../Common/Validators/Validators';


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
                roomEnemy: {
                    enemyName: "",
                    enemyATK: 0,
                    enemyWeapon:{
                        objectName: "",
                        objectType: "",
                        objectValue: 0,
                        objectWeight: 0
                    },
                    enemyDesc: "",
                },
                roomEnemyHealth: 1,
                roomEnemyAlive: false,
                roomLeftBool: false,
                roomRightBool: false,
                roomForwardBool: false,
                roomBackwardBool: false
            },
            allInventory: [],
            allV: [],
            msg: "",
        }
    }
    async componentDidMount(){
        if(this.state.name==="AAAAA"){
            alert("An error has ocurred. Please log in again");
            return(<Redirect to="/login"/>);
        }
        let email:string|null = (getLocalStorage("email")||"AAAAA");
        console.log("EMAIL: ",email);
        saxios.get(
            `/api/user/myUser/${email}`
        )
        .then(
            ({data})=>{
                if(data == null){
                    naxios.post(
                        `api/user/new`,
                        {
                            name: this.state.name,
                            email: email
                        }
                    )
                    window.location.reload();
                }else{
                    this.setState({
                        user: data,
                        msg: "",
                        allText: data.userCommands
                    },()=>{
                        if(this.state.user.userRealHealth<=0){
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
                                    this.componentDidMount();
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
                                    },()=>{
                                        const words:string[] = this.state.allText[this.state.allText.length-1].split(" ");
                                        if(allMoves.test(words[1])){
                                            if(this.state.room.roomEnemyAlive){
                                                this.state.allText.push(`${this.state.room.roomEnterEnemy}`);
                                                this.addAndSetState();
                                            }else{
                                                this.state.allText.push(`${this.state.room.roomEnter}`);
                                                this.addAndSetState();
                                            }
                                        }
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
            }
        )
        .catch(
            (err)=>{
                console.log(err);
            }
        )
        this.setState({
            allInventory: await saxios.get(`/api/user/allInvObjects`),
            allV: await saxios.get(`api/user/allVerbs`)
        });
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
        this.componentDidMount();
    }
    getHit = (newHP:number) =>{
        let user:IUser = this.state.user;
        this.setState({
            user:{
                ...user,
                userRealHealth: newHP,
            }
        },()=>{
            saxios.put(
                `/api/user/getHit`,
                {
                    userN: this.state.name,
                    health: newHP
                }
            )
            .then(
                ({data})=>{
                    this.addAndSetState();
                }
            )
            .catch(
                (err)=>{
                    console.log(err);
                }
            )    
        })
    }
    hitEnemy=(remainingHealth:number)=>{
            saxios.put(
                `/api/user/hitEnemy`,
                {
                    userN: this.state.name,
                    roomN: this.state.room.roomName,
                    newHP: remainingHealth,
                }
            )
            .then(
                ({data})=>{
                    this.addAndSetState();
                }
            )
            .catch(
                (err)=>{
                    console.log(err);
                }
            )    

    }
    killEnemy = () =>{
        let room:IRoom = this.state.room;
        this.setState({
            room:{
                ...room,
                roomEnemyAlive:false,
            }
        },()=>{
            saxios.put(
                `/api/user/killedEnemy`,
                {
                    userN: this.state.name,
                    roomN: this.state.room.roomName,
                }
            )
            .then(
                ({data})=>{
                    saxios.get(
                        `/api/user/allChestRoom`
                    )
                    .then(
                        ({data})=>{
                            for(let a:number=0;a<data.length;a++){
                                if(data[a].roomID===this.state.user.userCurrentRoom){
                                    let chestName:string = data[a].chest.objectName;
                                    saxios.put(
                                        `/api/user/addChestToRoom`,
                                        {
                                            uName: this.state.name, 
                                            currentRName: this.state.room.roomName, 
                                            chest: data[a].chest
                                        }
                                    )
                                    .then(
                                        ({data})=>{
                                            this.state.allText.push(`As the enemy vanishes into thin air, a chest appears out of nowhere.
                                            The chest has an inscription that says "${chestName}".
                                            With the chest being closed, you'll need to open it to reveal its contents`);
                                            this.addAndSetState();
                                        }
                                    )
                                    .catch(
                                        (err)=>{
                                            console.log(err);
                                        }
                                    )
                                }
                            }
                        }
                    )
                    .catch(
                        (err)=>{
                            console.log(err);
                        }
                    )
                }
            )
            .catch(
                (err)=>{
                    console.log(err);
                }
            )    
        })
    }
    directionAttack = (dir:string, h:number) =>{
        let direction:IEquip = {
            objectName: "",
            objectType: "",
            objectValue: 0,
            objectWeight: 0
        };

        if(dir==="left"){
            direction = this.state.user.userLeftEquip;
        }else{
            direction = this.state.user.userRightEquip;
        }
        let enemy:IEnemy = this.state.room.roomEnemy;
        let me:IUser = this.state.user;
        let room:IRoom = this.state.room;
        this.state.allText.push(`You attacked with a ${direction.objectName}, dealing ${me.userAtk+direction.objectValue} damage`);
        let remainingHealth:number = (h - (me.userAtk+direction.objectValue));
        //Subtract from enemy
        this.hitEnemy(remainingHealth);
        this.setState({
            room:{
                ...room,
                roomEnemyHealth:remainingHealth
            }
        },()=>{
            if(remainingHealth<=0){
                this.state.allText.push(`${enemy.enemyName} died...`)
                //change roomEnemyAlive a false
                this.killEnemy();
            }
        });
        return remainingHealth;
    }
    enemyAttack = (dir:string) =>{
        let direction:IEquip = {
            objectName: "",
            objectType: "",
            objectValue: 0,
            objectWeight: 0
        };
        if(dir==="left"){
            direction = this.state.user.userLeftEquip;
        }else{
            direction = this.state.user.userRightEquip;
        }
        let enemy:IEnemy = this.state.room.roomEnemy;
        let me:IUser = this.state.user;
        let rslt:number=0;
        if(direction.objectValue>=(enemy.enemyATK+enemy.enemyWeapon.objectValue)){
            rslt=0;
        }else{
            rslt=(direction.objectValue-(enemy.enemyATK+enemy.enemyWeapon.objectValue));
        }
        this.state.allText.push(`${enemy.enemyName} attacked with ${enemy.enemyWeapon.objectName}, 
        dealing ${enemy.enemyATK+enemy.enemyWeapon.objectValue} damage, but with your ${direction.objectName},
        you reduced the damage to ${rslt}`);
        //subtract from you (using rslt)
        let remainingHealth:number = (me.userRealHealth-(enemy.enemyATK+enemy.enemyWeapon.objectValue));
        this.getHit(remainingHealth);
        if(me.userRealHealth<=0){
            //Take to kill code(Which is at the end, because it checks for death every didMount)
            return false;
        }
        return true;
    }
    attackSequence = ()=>{
        let left:IEquip = this.state.user.userLeftEquip;
        let right:IEquip = this.state.user.userRightEquip;
        let enemy:IEnemy = this.state.room.roomEnemy;
        let me:IUser = this.state.user;
        let room:IRoom = this.state.room;
        if(left.objectType==="ATK"){
            if(right.objectType==="ATK"){
                if(left.objectWeight<=enemy.enemyWeapon.objectWeight){
                    if(left.objectWeight+right.objectWeight<=enemy.enemyWeapon.objectWeight){
                        this.state.allText.push(`You attacked with the ${left.objectName} followed by ${right.objectName},
                        making a total of ${(2*me.userAtk)+left.objectValue+right.objectValue}`);
                        //Subtract from enemy
                        let remainingHealth:number = (room.roomEnemyHealth - (me.userAtk*(left.objectValue+right.objectValue)));
                        this.hitEnemy(remainingHealth);
                        if((room.roomEnemyHealth-(me.userAtk*(left.objectValue+right.objectValue)))>0){
                            this.state.allText.push(`${enemy.enemyName} attacked with ${enemy.enemyWeapon.objectName}, 
                            dealing ${enemy.enemyATK+enemy.enemyWeapon.objectValue} damage`);
                           //subtract from you
                           let myNewHP = (me.userRealHealth - (enemy.enemyATK+enemy.enemyWeapon.objectValue));
                           this.getHit(myNewHP);
                        }else{
                            this.state.allText.push(`${enemy.enemyName} died...`);
                            this.killEnemy();
                        }
                    }else{
                        let h:number = this.directionAttack("left", this.state.room.roomEnemyHealth);
                        if(h>0){
                            this.state.allText.push(`${enemy.enemyName} attacked with ${enemy.enemyWeapon.objectName}, 
                            dealing ${enemy.enemyATK+enemy.enemyWeapon.objectValue} damage`);
                            //subtract from you
                            let myNewHP = (me.userRealHealth - (enemy.enemyATK+enemy.enemyWeapon.objectValue));
                            this.getHit(myNewHP);
                            if(me.userRealHealth>0){
                                this.directionAttack("right", h);
                            }
                        }
                    }
                }else if(right.objectWeight<=enemy.enemyWeapon.objectWeight){
                    let h:number = this.directionAttack("right", this.state.room.roomEnemyHealth);
                    if(h>0){
                        this.state.allText.push(`${enemy.enemyName} attacked with ${enemy.enemyWeapon.objectName}, 
                        dealing ${enemy.enemyATK+enemy.enemyWeapon.objectValue} damage`);
                        //subtract from you
                        let myNewHP = (me.userRealHealth - (enemy.enemyATK+enemy.enemyWeapon.objectValue));
                        this.getHit(myNewHP);
                        if(me.userRealHealth>0){
                            this.directionAttack("left", h)
                        }
                    }
                }else{
                    this.state.allText.push(`${enemy.enemyName} attacked with ${enemy.enemyWeapon.objectName}, 
                    dealing ${enemy.enemyATK+enemy.enemyWeapon.objectValue} damage`);
                    //subtract from you
                    let myNewHP = (me.userRealHealth - (enemy.enemyATK+enemy.enemyWeapon.objectValue));
                    this.getHit(myNewHP);
                    if(me.userRealHealth>0){
                        this.state.allText.push(`You attacked with the ${left.objectName} followed by ${right.objectName},
                        making a total of ${me.userAtk*(left.objectValue+right.objectValue)}`);
                        //Subtract from enemy
                        let remainingHealth:number = (room.roomEnemyHealth - (me.userAtk*(left.objectValue+right.objectValue)));
                        this.hitEnemy(remainingHealth);
                        if((room.roomEnemyHealth-(me.userAtk*(left.objectValue+right.objectValue)))<=0){
                            this.state.allText.push(`${enemy.enemyName} died...`);
                            this.killEnemy();
                        }
                    }
                }
            }else{
                if(right.objectWeight+left.objectWeight <= enemy.enemyWeapon.objectWeight){
                    if(this.directionAttack("left", this.state.room.roomEnemyHealth)>0){
                        this.enemyAttack("right");
                    }
                }else{
                    if(this.enemyAttack("right")){
                        this.directionAttack("left", this.state.room.roomEnemyHealth);
                    }
                }
            }
        }else if(right.objectType==="ATK"){
            if(right.objectWeight+left.objectWeight <= enemy.enemyWeapon.objectWeight){
                if(this.directionAttack("right", this.state.room.roomEnemyHealth)>0){
                    this.enemyAttack("left");
                }
            }else{
                if(this.enemyAttack("left")){
                    this.directionAttack("right", this.state.room.roomEnemyHealth);
                }   
            }
        }else{
            this.state.allText.push(`You have nothing to attack with, try equipping a useful weapon`);
        }
        this.addAndSetState();
    }
    checkIfKey = (words:string[])=>{
        if((words[2]==="door" || words[2]==="doors") && words[0]==="open"){
            let obj:string = words[1].charAt(0).toUpperCase()+words[1].slice(1)+" Key";
            for (let x:number=0;x<this.state.user.userInventory.length;x++){
                if(this.state.user.userInventory[x].objectName===obj){
                    return true;
                }
            }
            return false;
        }
    }
    changeRoom=(room:ObjectID|string)=>{
        saxios.put(
            `/api/user/changeRoom`,
            {
                uName: this.state.name,
                roomID: room
            }
        )
        .then(
            ({data})=>{
                this.addAndSetState();
            }
        )
        .catch(
            (err)=>{
                console.log(err);
            }
        )
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

        let printed:boolean = false;//to see if it has already printed something or not

        //Special case for Equip and Unequip
        let direction:string = "AAAAAAAAAA";
        let errorEquipUnequip:boolean = false;
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
            if(this.state.room.roomEnemyAlive){
                this.state.allText.push(`You're in a battle! Its his life or yours. Don't be reckless, if you die, I die as well.
                You can equip some items from your inventory to fight. Once you decide to attack, just type "attack". As a famous
                general once said: "Good luck".`);
            }else{
                this.state.allText.push(`Help is on its way. You have various ways of interacting with the world around you.
                Just as you just used the verb "help", you can use other verbs to make this world change.
                For instance, if you want to move, you type "move" and a direction. 
                If you want to grab something, type "grab" followed by the object you want to try and grab.
                If you want to get more knowledge of other verbs, type "help" followed by the verb you want to know more about.
                If you want to look at your surroundings, type "look".
                In the spirit of encouraging exploration, try different verbs and see their effects!...
                But... If you want a list of all verbs available, type "verb list"`);    
            }
        }else if((realWords[0]==="exit" || realWords[0]==="close") && realWords.length===1){
            this.state.allText.push(`Your progress is automatically saved every command you make.
            If you want to exit, just press Logout or Adventure at the top of your screen`);
        }
        else if(realWords[0]==="eat"){
            this.state.allText.push(`Rather than eating a questionable item, I implore you to "use" it. For your (and my) health.`);
        }
        else if(realWords[0]==="inventory"){
            let uInv:string[] = [];
            for(let a:number=0;a<this.state.user.userInventory.length;a++){
                uInv.push(this.state.user.userInventory[a].objectName);
            }
            this.state.allText.push(`Your current inventory is: ${uInv}`);
        }
        else if(realWords[0]==="status"){
            this.state.allText.push(`Your current health is: ${this.state.user.userRealHealth}/${this.state.user.userBaseHealth}.
            In your left hand a(an): ${this.state.user.userLeftEquip.objectName}. In your right hand you have a(an): ${this.state.user.userRightEquip.objectName}`);
        }
        else if(realWords[0]==="look" || realWords[0]==="observe"){
            let uInv:string[] = [];
            for(let a:number=0;a<this.state.room.roomObjectsInv.length;a++){
                uInv.push(this.state.room.roomObjectsInv[a].objectName);
            }
            if(uInv.length===0){
                    this.state.allText.push(`${this.state.room.roomLook}`);
            }else{
                    this.state.allText.push(`${this.state.room.roomLook}. In the room you can find: ${uInv}`); 
            }
        }
        else if((realWords[0]==="attack" || realWords[0]==="kill" || realWords[0]==="damage" || realWords[0]==="hit") && realWords.length>1){
            this.state.allText.push(`If you wish to attack, just type "${realWords[0]}", the complicated maths of what to use 
            and whom to attack have been figured out by me, your conscience. (No need to praise, but some recognition isn't bad at all).`);
        }
        else if(realWords[0]==="attack" || realWords[0]==="kill" || realWords[0]==="damage" || realWords[0]==="hit"){
            if(this.state.room.roomEnemyAlive){
                this.attackSequence();
            }else{
                this.state.allText.push(`If there is no battle, there no need to ${realWords[0]} anything`);
            }
        }
        else if((realWords[0]==="thanks" && realWords.length===1) || (realWords[0]==="thank" && realWords[1]==="you" && realWords.length===2)){
            this.state.allText.push(`You're welcome. I'm glad to help. Also, its really gratifying to hear a compliment`);
        }
        else if(realWords[0]==="restart" || realWords[0]==="reset" || realWords[0]==="suicide" || (realWords[0]==="kill" && realWords[1]==="me")){
            this.state.allText.push(`After thinking all of what you've been through, you decide its no longer worth it,
            which means... you'll take your own life. As your conscience, I fear nothing, since I know a little secret. 
            But remember, it's a secret to everybody (And now I'm talking to you, player)(and yes, breaking forth wall, bla bla)
            The little secret is that this world is constructed so that each time ${this.state.name} dies, 
            ${this.state.name} comes back alive. So please, enjoy replaying the adventure once more`);
            this.getHit(-7);
        }
        else if(realWords.length===1){
            this.state.allText.push(`You can't possibly think to "${realWords[0]}" without a something or a somewhere,
            so please, after every verb, please choose an object to interact with`);
        }
        else if(realWords[0]==="close"){
            this.state.allText.push(`There is no benefit in closing something, so why try and close it? Just... leave it as it is.`);
        }
        else if((realWords[0]==="move"  || realWords[0]==="go") && realWords.length>2){
            this.state.allText.push(`If you want to try and move an object, please use pull or push, its more specific`);
        }
        else if((realWords[0]==="open") && realWords.length===2){            
            this.state.allText.push(`There may be more than 1 object with that generic name, please be more specific with the object you interact with`)
        }
        else if(realWords[0]==="verb" && realWords[1]==="list" && realWords.length===2){
            let verbs:string[] = [];
            for (let a:number=0;a<this.state.allV.length;a++){
                verbs.push((" "+this.state.allV[a].name));
            }
            this.state.allText.push(`All the actions you could possibly perform are the following: ${verbs}. 
            If you want an in-depth explanation of each one, type "help" followed by the verb you want more info about`)
        }
        else if(realWords[0]==="move" || realWords[0]==="go"){
            let roomDecision:ObjectID|string = "";
            if(realWords[1]==="forward" || realWords[1]==="front" ||  realWords[1]==="ahead" || realWords[1]==="north"){
                if(this.state.room.roomForwardBool){
                    if(this.state.room.roomEnemyAlive){
                        this.state.allText.push("You can't run away from a battle");
                    }else{
                        if(this.state.room.roomForward.toString().length>25){
                            this.state.allText.push(`${this.state.room.roomForward}`);
                        }else{
                            roomDecision = this.state.room.roomForward;
                            this.changeRoom(roomDecision);
                        }
                    }
                }else{
                    this.state.allText.push("Your path is blocked. Find a way get where you want");
                }
            }else if(realWords[1]==="backward" || realWords[1]==="back" || realWords[1]==="behind" || realWords[1]==="south"){
                if(this.state.room.roomBackwardBool){
                    if(this.state.room.roomEnemyAlive){
                        this.state.allText.push("You can't run away from a battle");
                    }else{
                        if(this.state.room.roomBackward.toString().length>25){
                            this.state.allText.push(`${this.state.room.roomBackward}`);
                        }else{
                            roomDecision = this.state.room.roomBackward;
                            this.changeRoom(roomDecision);
                        }
                    }
                }else{
                    this.state.allText.push("Your path is blocked. Find a way get where you want");
                }
            }else if(realWords[1]==="left" || realWords[1]==="west"){
                if(this.state.room.roomLeftBool){
                    if(this.state.room.roomEnemyAlive){
                        this.state.allText.push("You can't run away from a battle");
                    }else{
                        if(this.state.room.roomLeft.toString().length>25){
                            this.state.allText.push(`${this.state.room.roomLeft}`);
                        }else{
                            roomDecision = this.state.room.roomLeft;
                            this.changeRoom(roomDecision);
                        }
                    }
                }else{
                    this.state.allText.push("Your path is blocked. Find a way get where you want");
                }
            }else if(realWords[1]==="east" || realWords[1]==="right" ){
                if(this.state.room.roomRightBool){
                    if(this.state.room.roomEnemyAlive){
                        this.state.allText.push("You can't run away from a battle");
                    }else{
                        if(this.state.room.roomRight.toString().length>25){
                            this.state.allText.push(`${this.state.room.roomRight}`);
                        }else{
                            roomDecision = this.state.room.roomRight;
                            this.changeRoom(roomDecision);
                        }
                    }
                }else{
                    this.state.allText.push("Your path is blocked. Find a way get where you want");
                }
                this.addAndSetState();
            }else{
                this.state.allText.push(`That is not a valid way to move. Please type a valid "move" command`);
                this.addAndSetState();
            }
        }
        else{
            if(!errorEquipUnequip){
                saxios.get(`api/user/allVerbs`)
                .then(
                    ({data})=>{
                        let allV:IVerbs[] = data;
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
                                                for(let c:number = 0;c<(Object.entries(this.state.room.roomObjectsEnv[a])).length;c++){
                                                    if(Object.entries(this.state.room.roomObjectsEnv[a])[c][0]===(verbText+"Bool")){
                                                        if (Object.entries(this.state.room.roomObjectsEnv[a])[c][1] || this.checkIfKey(realWords)){
                                                            let uri:string = '';
                                                            let msg:string = '';
                                                            if(realWords[0]==="open"){
                                                                msg = `${(Object.entries(this.state.room.roomObjectsEnv[a]))[b][1]}`;
                                                                if(realWords[2]==="door"||realWords[2]==="doors"||realWords[2]==="Door"||realWords[2]==="doors"){
                                                                    uri = `/api/user/openDoor`;
                                                                    msg=`You opened the ${objectTextUpC}`;
                                                                }
                                                                if(realWords[2]==="chest"||realWords[2]==="Chest"){
                                                                    uri = `/api/user/openChest`;
                                                                }
                                                            }
                                                            if(uri!==''){
                                                                saxios.put(
                                                                    uri,
                                                                    {
                                                                        roomID: this.state.user.userCurrentRoom,
                                                                        uName: this.state.name,
                                                                        objectN: objectTextUpC,
                                                                        InvObjs: this.state.user.userInventory,
                                                                    }
                                                                )
                                                                .then(
                                                                    ({data})=>{
                                                                        this.state.allText.push(msg);
                                                                        if(data.more){
                                                                            this.state.allText.push(data.more);
                                                                        }
                                                                        this.addAndSetState();
                                                                    }
                                                                )
                                                                .catch(
                                                                    (err)=>{
                                                                        console.log(err);
                                                                    }
                                                                )
                                                                printed=true;
                                                            }
                                                        }else{
                                                            this.state.allText.push(`${(Object.entries(this.state.room.roomObjectsEnv[a]))[b][1]}`);
                                                            printed=true;
                                                            this.addAndSetState();
                                                        }
                                                    }
                                                }  
                                            }
                                        }
                                    }
                                }
                                let ifInv:boolean = false;
                                for(let c:number=0;c<this.state.allInventory.length;c++){
                                    if(this.state.allInventory[c].objectName===objectTextUpC){
                                        ifInv=true;
                                    }
                                }
                                if(ifInv){
                                    let mainArray:any[] = [];
                                    let uri:string = ``;
                                    if(verbText==="objectGrab"){
                                        mainArray = this.state.room.roomObjectsInv;
                                        uri = `/api/user/grab`;
                                    }
                                    else if(verbText==="objectUse" && realWords[2]==="key"){
                                        uri = `/api/user/useKey`;
                                        mainArray = this.state.user.userInventory;
                                    }
                                    else if(verbText==="objectUse" || verbText==="objectEat"){
                                        uri = `/api/user/useHealingItem`;
                                        mainArray = this.state.user.userInventory;
                                    }
                                    else if(verbText!=="objectDrop" && verbText!=="objectEquip" && verbText!=="objectUnequip"){
                                        mainArray = this.state.user.userInventory;
                                    }
                                    else{
                                        for(let s:number=0;s<this.state.room.roomObjectsInv.length;s++){
                                            mainArray.push(this.state.room.roomObjectsInv[s]);
                                        }
                                        for(let s:number=0;s<this.state.user.userInventory.length;s++){
                                            mainArray.push(this.state.user.userInventory[s]);
                                        }
                                    }
                                    for(let a:number=0;a<mainArray.length;a++){
                                        if(mainArray[a].objectName === objectTextUpC){
                                            for(let b:number = 0;b<(Object.entries(mainArray[a])).length;b++){
                                                if(Object.entries(mainArray[a])[b][0]===verbText){
                                                    let obj:string=mainArray[a]
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
                                                    if(uri!==`` && !printed){
                                                        saxios.put(
                                                            `${uri}`,
                                                            {
                                                                object: obj,
                                                                currentRName: this.state.room.roomName,
                                                                currentRID: this.state.user.userCurrentRoom,
                                                                uName: this.state.name,
                                                                InvObjs: mainArray,
                                                                leftE: this.state.user.userLeftEquip.objectName,
                                                                rightE: this.state.user.userRightEquip.objectName,
                                                                dir: direction,
                                                                realH: this.state.user.userRealHealth,
                                                                baseH: this.state.user.userBaseHealth,
                                                                doorP: realWords[1].charAt(0).toUpperCase()+realWords[1].slice(1),
                                                            }
                                                        )
                                                        .then(
                                                            ({data})=>{
                                                                if(data.msg!==undefined || data.length>0){
                                                                    this.state.allText.push(`${data.msg}`);
                                                                }
                                                                if((!data.msg) || data.msg==="" || data.length===0){
                                                                    this.state.allText.push((Object.entries(mainArray[a])[b][1] as string));
                                                                }
                                                                if(data.more){
                                                                    this.state.allText.push(`${data.more}`);
                                                                }
                                                                this.setState({
                                                                    msg: ""
                                                                },()=>{
                                                                    this.addAndSetState();
                                                                });
                                                            }
                                                        )
                                                        .catch(
                                                            (err)=>{
                                                                console.log(err);
                                                            }
                                                        )
                                                        printed=true; 
                                                    }
                                                    if(!printed){
                                                        this.addAndSetState();
                                                        printed=true;  
                                                        
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if(!printed){
                                        this.state.allText.push(`There's no ${objectTextUpC} available to ${allV[c].associateVerb}`);
                                        this.addAndSetState();
                                        printed=true;
                                    }
                                }
                            }
                        }
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
        if(!printed){
            this.addAndSetState();
        }
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
        let num:number=0;
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
            <Page>
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
                            className="form-control bg-secondary text-white" 
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
    allInventory: any[];
    allV: any[];
    msg: string;
}
interface IUser{
    _id: string;
    userCurrentRoom: ObjectID|string;
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
    roomEnemy: IEnemy;
    roomEnemyHealth: number;
    roomEnemyAlive: boolean;
    roomLeftBool: boolean;
    roomRightBool: boolean;
    roomForwardBool: boolean;
    roomBackwardBool: boolean;
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
interface IEnemy{
    enemyName: string;
    enemyATK: number;
    enemyWeapon: IEquip;
    enemyDesc: string;
}