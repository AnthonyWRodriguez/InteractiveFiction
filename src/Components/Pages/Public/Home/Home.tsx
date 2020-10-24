import React from 'react';
import Page from '../../Page';
import 'bootstrap/dist/css/bootstrap.css';
import { setLocalStorage } from '../../../Utilities/Utilities';
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";
import { setJWTBearer } from '../../../Utilities/Utilities'

const Home = () => {

    const { user, getAccessTokenSilently } = useAuth0();
    const history = useHistory();
  
    return(
        <Page>
            <div className="container">
                <button 
                    className="btn btn-danger col-sm-12"
                    onClick={async()=>{
                        if(user?.email && user?.name){
                            setLocalStorage('name', user.name);
                            setLocalStorage('email', user.email);
                            setJWTBearer(await getAccessTokenSilently())
                            alert(`Welcome to your adventure ${user.name}`);
                            history.push("/game");
                        }else{
                            alert("Please login to start your adventure");
                        }
                    }}
                >
                    PLAY
                </button>
            </div>
        </Page>
    )
};
  
export default Home;