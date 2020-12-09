/* eslint-disable import/prefer-default-export, no-unused-vars, import/no-cycle */
import * as React from 'react';
import ReactDOM from 'react-dom';
import { GoogleLogout } from 'react-google-login';
import { Content } from './Content';

import { Socket } from './Socket';

function handleLogout(response) {
  console.log('logout success');
  const out = 'logged out';
  Socket.emit('old google user', {
    'logged out': out,
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
        icon
      >
        <span>Logout</span>
      </GoogleLogout>
    </div>
  );
}
