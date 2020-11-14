import * as React from 'react';
import { Socket } from './Socket';
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';
import { Content } from './Content';
import FontAwesome from "react-fontawesome";
import { GoogleLogout } from 'react-google-login';

function handleLogout(response) {
    console.log("logout success")
    let out = "logged out"
    Socket.emit('old google user', {
        'logged out': out
    });
    ReactDOM.render(<Content />, document.getElementById('content'));
}

export function LogoutButton() {
    return (
        <div>
        <GoogleLogout
          clientId="302650247126-s5e8h5q79ebdsataucisgvsavjjp38as.apps.googleusercontent.com"
          buttonText="Logout"
          onLogoutSuccess={handleLogout}
          icon={true}
        >
            <span>Logout</span>
        </GoogleLogout>
        </div>
    );
}
