import React, {Component} from 'react';
import {BrowserRouter as Router, Route,Switch,Redirect} from "react-router-dom";
import Home from './Components/Pages/Public/Home';

class App extends Component{
  constructor(props: object){
    super(props);
    this.state = {

    };
  }
  render(){
    return(
      <Router>
        <Switch>
          <Route component={Home} path="/" exact />
        </Switch>
      </Router>
    )
  }
}

export default App;
