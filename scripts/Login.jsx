import * as React from 'react';
import { Socket } from './Socket';

import { GoogleButton } from './GoogleButton';

export function Login() {
    
    return (
        <div>
        <h1>sign in</h1>
            <GoogleButton />
        </div>
    );
}
