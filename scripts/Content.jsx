    
import * as React from 'react';

import { List } from 'semantic-ui-react';
import { Button } from './Button';
import { Socket } from './Socket';
import { KrogerLogin } from './KrogerLogin';
import { GoogleButton } from './GoogleButton';

export function Content() {
    const [addresses, setAddresses] = React.useState([]);
    const [recImage, setRecImage] = React.useState([]);
    const [recTitle, setRecTitle] = React.useState([]);
    const [user, setUser] = React.useState([]);
    var recipeImages;
    
    function getNewAddresses() {
        React.useEffect(() => {
            Socket.on('searches received', (data) => {
                console.log("Received searches from server: " + data['allSearches']);
                setAddresses(data['allSearches']);
                setRecImage(data['recipeImage']);
                setRecTitle(data['recipeTitle']);
                setUser(data['username']);
            })
        });
    }
    
    function updateAddresses(data) {
        // setRecTitle(data['recipeTitle']);
        // var recipeImages = data['recipeImage'].map((im, index) => (
        // <List.Item>{im}</List.Item>));
        setUser(data['username']);
    }
    
    getNewAddresses();
    
    // const recipeImages = data['recipeImage'].map((im, index) => (
    //     <List.Item>{im}</List.Item>
    // ));

    return (
        <div>
            <h1>InfiniteRecipes!</h1>
            <GoogleButton/>
            <h3>{user}</h3>
            <br/>
            <center><Button/></center>
            <br/>
            <ol>
                {
                    recImage.map((im, index) =><img src={im}/>,
                        recTitle.map((t, ind) =><p>{t}</p>)
                    )
                }
            </ol>
            <h2>{recTitle}</h2>
            <br/>
        </div>
    );
}
