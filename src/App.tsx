import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {getLocalStorage} from './Components/Utilities/Utilities';
import Auth0ProviderWithHistory from "./Components/Common/Auth/auth0-provider-with-history";
import ProtectedRoute from './Components/Common/Auth/protected-route';
import { useAuth0 } from "@auth0/auth0-react";

import Home from './Components/Pages/Public/Home/Home';
import Game from './Components/Pages/Private/Game/Game';

const App = () =>{
  return(
    <Router>
      <Auth0ProviderWithHistory>
        <Switch>
          <Route render={() => { return (<Home/>) }} path="/" exact />
          <ProtectedRoute component={Game} path="/game" auth={useAuth0().user?.email}/>
        </Switch>
      </Auth0ProviderWithHistory>
    </Router>
  )
}
export default App;
/*
class App extends Component<IAppProps, IAppState>{
  constructor(props: IAppProps){
    super(props);
    this.state = {
      username: (getLocalStorage("name")||''),
      useremail: (getLocalStorage("email")||''),
    };
  }
  render(){
    const auth = {
      email: this.state.useremail,
      name: this.state.username
    }

  }
}



interface IAppProps{

}
interface IAppState{
  username: string;
  useremail: string;
}*/