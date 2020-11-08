    
import * as React from 'react';


import { Button } from './Button';
import { Socket } from './Socket';
import { KrogerLogin } from './KrogerLogin';
import { Login } from './Login';

export function Content() {
    const [addresses, setAddresses] = React.useState([]);
    const [recImage, setRecImage] = React.useState([]);
    const [recTitle, setRecTitle] = React.useState([]);
    
    function getNewAddresses() {
        React.useEffect(() => {
            Socket.on('searches received', updateAddresses, (data) => {
                console.log("Received searches from server: " + data['allSearches']);
                setAddresses(data['allSearches']);
            })
        });
    }
    
    function updateAddresses(data) {
        console.log("image and title here");
        setRecImage(data['recipeImage']);
        setRecTitle(data['recipeTitle']);
        console.log("image and title again here");
    }
    
    getNewAddresses();

    return (
        <div>
            <h1>InfiniteRecipes!</h1>
            <Login/>
            <br/>
            <center><Button/></center>
            <br/>
            <img src={recImage}/>
            <h2>{recTitle}</h2>
            <br/>
        </div>
    );
}
