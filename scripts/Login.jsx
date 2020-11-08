import * as React from 'react';
import { Socket } from './Socket';

import { GoogleButton } from './GoogleButton';

export function Login() {
    const [accounts, setAccounts] = React.useState([]);
    
    function getAllAccounts() {
        React.useEffect(() => {
            Socket.on('accounts received', (data) => {
                let allAccounts = data['allUsers'];
                console.log("Received accounts from server: " + allAccounts);
                setAccounts(allAccounts);
            })
        });
    }
    
    getAllAccounts();
    
    return (
        <div>
            <GoogleButton />
        </div>
    );
}
