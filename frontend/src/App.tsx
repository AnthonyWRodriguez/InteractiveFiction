import React, {Component} from 'react';
import {BrowserRouter as Router, Route,Switch,Redirect} from "react-router-dom";
import Home from './Components/Pages/Public/Home/Home';
import Login from './Components/Pages/Public/Login/Login';
import { setLocalStorage, getLocalStorage } from './Components/Utilities/Utilities';

class App extends Component<IAppProps, IAppState>{
  constructor(props: IAppProps){
    super(props);
    this.state = {
      username: (getLocalStorage("name")||''),
      useremail: (getLocalStorage("email")||''),
    };
  }
  login=(name: string, email: string)=>{
    const uName = name;
    const uEmail = email;
    this.setState({
      username: uName,
      useremail: uEmail
    });
    setLocalStorage("name", uName);
    setLocalStorage("email", uEmail);
  }
  render(){
    const auth = {
      name: this.state.username
    }
    return(
      <Router>
        <Switch>
          <Route render={(props) => { return (<Home {...props} auth={auth}/>) }} path="/" exact />
          <Route render={(props) => { return (<Login {...props} auth={auth} log_in={this.login}/>)}} path="/login" exact/>
        </Switch>
      </Router>
    )
  }
}

export default App;

interface IAppProps{

}
interface IAppState{
  username: string;
  useremail: string;
}