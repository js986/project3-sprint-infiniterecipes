    
import * as React from 'react';
import ReactDOM from 'react-dom';
import { List, Card, Button, Image } from 'semantic-ui-react';
import { SearchButton } from './SearchButton';
import { Socket } from './Socket';
import { GoogleButton } from './GoogleButton';
import { Recipe } from './Recipe';

export function Content() {
    const [recipes, setRecipes] = React.useState([]);
    const [user, setUser] = React.useState([]);
    var recipeImages;
    
    function getNewRecipes() {
        React.useEffect(() => {
            Socket.on('recipes received', (data) => {
                console.log("Received recipes from server: " + data['all_display']);
                setRecipes(data['all_display']);
            })
        });
    }
    
    function updateRecipes() {
        Socket.on('search results received', (data) => {
            console.log("Received search results from server: " + data['search_output']);
            setRecipes(data['search_output'])
        })
    }
    
    function handleSubmit(event){
        event.preventDefault();
        console.log("Handling submit")
        ReactDOM.render(<Recipe />, document.getElementById('content'));
    }
    
    getNewRecipes();
    
    const recipeList = recipes.map((recipe, index) => (
        <List.Item>
            <Card>
                <Button onClick={handleSubmit}><Image src={recipe["images"][0]} wrapped ui={false} /></Button>
                <Card.Content>
                  <Card.Header>{recipe["title"]}</Card.Header>
                  <Card.Meta>
                    <span className='difficulty'>{recipe["difficulty"]}</span>
                  </Card.Meta>
                  <Card.Description>
                    {recipe["description"]}
                  </Card.Description>
                </Card.Content>
            </Card>
        </List.Item>
    ));

    return (
        <div>
            <h1>InfiniteRecipes!</h1>
            <GoogleButton/>
            <h3>{user}</h3>
            <br/>
            <center><SearchButton/></center>
            <br/>
            <List>
                {recipeList}
            </List>
            <br/>
        </div>
    );
}
