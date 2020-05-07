import React, {Component} from 'react';
import {BrowserRouter as Router, Route,Switch,Redirect} from "react-router-dom";
import Home from './Components/Pages/Public/Home/Home';
import Login from './Components/Pages/Public/Login/Login';
import {IAuth} from './Components/Common/Interfaces/Interfaces';

class App extends Component<IAppProps, IAppState>{
  constructor(props: IAppProps){
    super(props);
    this.state = {
      name: '',
    };
  }
  render(){
    const auth = {
      name: this.state.name
    }
    return(
      <Router>
        <Switch>
          <Route render={(props) => { return (<Home {...props} auth={auth}/>) }} path="/" exact />
          <Route render={(props) => { return (<Login {...props} auth={auth}/>)}} path="/login" exact/>
        </Switch>
      </Router>
    )
  }
}

export default App;

interface IAppProps{

}
interface IAppState{
  name: string;
}