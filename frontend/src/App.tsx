import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { setLocalStorage, getLocalStorage, removeLocalStorage } from './Components/Utilities/Utilities';
import Home from './Components/Pages/Public/Home/Home';
import Login from './Components/Pages/Public/Login/Login';
import New from './Components/Pages/Public/New/New';

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
  logout=()=>{
    this.setState({
      username: '',
      useremail: ''
    });
    removeLocalStorage("name");
    removeLocalStorage("email");
  }
  render(){
    const auth = {
      email: this.state.useremail,
      logout: this.logout
    }
    return(
      <Router>
        <Switch>
          <Route render={(props) => { return (<Home {...props} auth={auth}/>) }} path="/" exact />
          <Route render={(props) => { return (<Login {...props} auth={auth} log_in={this.login} />)}} path="/login" exact/>
          <Route render={(props) => { return (<New {...props} auth={auth}/>)}} path='/new' exact/>
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