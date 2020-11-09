    
import * as React from 'react';

import { List } from 'semantic-ui-react';
import { Button } from './Button';
import { Socket } from './Socket';
import { KrogerLogin } from './KrogerLogin';
import { Login } from './Login';


export function Content() {
    const [addresses, setAddresses] = React.useState([]);
    const [recImage, setRecImage] = React.useState([]);
    const [recTitle, setRecTitle] = React.useState([]);
    var recipeImages;
    
    function getNewAddresses() {
        React.useEffect(() => {
            Socket.on('searches received', (data) => {
                console.log("Received searches from server: " + data['allSearches']);
                setAddresses(data['allSearches']);
                setRecImage(data['recipeImage']);
                setRecTitle(data['recipeTitle']);
                //  console.log("image---: " + data['recipeImage']);
                // setRecImage(data['recipeImage']);
                // setRecImage(recipeImages);
                // console.log("image---: " + recipeImages);
            })
        });
    }
    
    function updateAddresses(data) {
        console.log("image and title here");
        setRecTitle(data['recipeTitle']);
        console.log("image and title again here");
        
        var recipeImages = data['recipeImage'].map((im, index) => (
        <List.Item>{im}</List.Item>));
        console.log("image---: " + recipeImages);
    }
    
    getNewAddresses();
    
    // const recipeImages = data['recipeImage'].map((im, index) => (
    //     <List.Item>{im}</List.Item>
    // ));

    return (
        <div>
            <h1>InfiniteRecipes!</h1>
            <Login/>
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
