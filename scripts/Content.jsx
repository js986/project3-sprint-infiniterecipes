    
import * as React from 'react';


import { Button } from './Button';
import { Socket } from './Socket';

export function Content() {
    const [addresses, setAddresses] = React.useState([]);
    
    function getNewAddresses() {
        React.useEffect(() => {
            Socket.on('searches received', (data) => {
                console.log("Received searches from server: " + data['allSearches']);
                setAddresses(data['allSearches']);
            })
        });
    }
    
    getNewAddresses();

    return (
        <div>
            <h1>InfiniteRecipes!</h1>
            <Button/>
        </div>
    );
}
