    
import * as React from 'react';


import { Button } from './Button';
import { Socket } from './Socket';
import { KrogerLogin } from './KrogerLogin';

export function Content() {
    const [addresses, setAddresses] = React.useState([]);
    
    function getNewAddresses() {
        React.useEffect(() => {
            Socket.on('addresses received', (data) => {
                console.log("Received addresses from server: " + data['allAddresses']);
                setAddresses(data['allAddresses']);
            })
        });
    }
    
    getNewAddresses();

    return (
        <div>
            <h1>InfiniteRecipes!</h1>
            <br/>
            <input id="recipe_input" placeholder="Search for recipes here by ingredient, meal-type, cuisine, difficulty"></input>
            <button>SEARCH</button>
            <KrogerLogin/>
        </div>
    );
}
