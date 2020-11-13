    
import * as React from 'react';
import ReactDOM from 'react-dom';
import { List, Card, Button, Image, Container } from 'semantic-ui-react';
import { SearchButton } from './SearchButton';
import { Socket } from './Socket';
import { GoogleButton } from './GoogleButton';
import { Recipe } from './Recipe';
import { Cart } from './Cart';

export function Content() {
    const [recipes, setRecipes] = React.useState([]);
    const [guser, setGUser] = React.useState([]);
    const [isloggedin, setIsLoggedin] = React.useState(false);
    var recipeImages;
    
    function getNewRecipes() {
        React.useEffect(() => {
            Socket.on('recipes received', (data) => {
                console.log("Received recipes from server: " + data['all_display']);
                setRecipes(data['all_display']);
                
            })
        });
    }
    
    function updateLogin() {
         React.useEffect(() => {
            Socket.on('logged in', (data) => {
                setGUser(data['username']);
                setIsLoggedin(true);
            })
         });
    }
    
    function updateRecipes() {
        React.useEffect(() => {
            Socket.on('search results received', (data) => {
                console.log("Received search results from server: " + data['search_output']);
                setRecipes(data['search_output'])
            })
        });
    }
    
    function handleSubmit(id){
        Socket.emit('recipe page', {
            'id' : id
        });
        ReactDOM.render(<Recipe />, document.getElementById('content'));
    
    }
    
    function goToCart() {
        Socket.emit('cart page', {
            'cart': 'cart'
        });
        ReactDOM.render(<Cart />, document.getElementById('content'));
    }
    
    getNewRecipes();
    updateRecipes();
    updateLogin();
    
    const recipeList = recipes.map((recipe, index) => (
            <Card onClick={() => handleSubmit(recipe["id"])}>
                <Image src={recipe["images"][0]} wrapped ui={false} />
                <Card.Content>
                  <Card.Header>{recipe["title"]}</Card.Header>
                  <Card.Meta>
                    <span className='username'>By: {recipe["name"]}</span>
                  </Card.Meta>
                  <Card.Description>
                    <span className="description">{recipe["description"]}</span>
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <span className='difficulty'>{recipe["difficulty"]}</span>
                </Card.Content>
            </Card>
    ));

    return (
        <Container>
            <div>
                <p> <a href="about">About Us</a></p>
                <h1>InfiniteRecipes!</h1>
                <Button icon="cart" onClick={goToCart}/>
                <GoogleButton/>
                <h3>{guser}</h3>
                <br/>
                <center><SearchButton/></center>
                <br/>
                <Card.Group itemsPerRow={5}>
                    {recipeList}
                </Card.Group>
                <br/>
            </div>
        </Container>
    );
}
