import * as React from 'react';
import { Socket } from './Socket';
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';
import { Content } from './Content';
import FontAwesome from "react-fontawesome";
import { GoogleLogout } from 'react-google-login';

function handleSubmit(response) {
    console.log(response)
    Socket.emit('new google user', {
        'name': response.profileObj.name,
        'email' : response.profileObj.email,
        'imageURL': response.profileObj.imageUrl
    });
    
    console.log('Sent the name '+ response.profileObj.name + ' to server!');
    ReactDOM.render(<Content />, document.getElementById('content'));
}

export function GoogleButton() {
    return (
        <div>
        <GoogleLogin
        
        clientId="302650247126-s5e8h5q79ebdsataucisgvsavjjp38as.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={handleSubmit}
        onFailure={handleSubmit}
        cookiePolicy={'single_host_origin'}
        // isSignedIn={true}
         >
            <FontAwesome
              name='google'
            />
            <span>Login</span>
        </GoogleLogin>
        </div>
    );
}
