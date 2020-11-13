import * as React from 'react';
import ReactDOM from 'react-dom';
import { Container, Header, Divider, Rating, Button, Icon, Image, List, Label } from 'semantic-ui-react';
import { Socket } from './Socket';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { User } from './User';

export function Recipe({ id }) {
    const [recipe,setRecipe] = React.useState({});
    const [ingredients,setIngredients] = React.useState([]);
    const [instructions,setInstructions] = React.useState([]);
    const [tags,setTags] = React.useState([]);
    
    const ingredientList = ingredients.map((ingredient, index) => (
        <List.Item key={index} >{ingredient["name"]}</List.Item>
    ));
    
    const instructionsList = instructions.map((instruction, index) => (
        <List.Item key={index} >{instruction["step"]}</List.Item>
    ));
    
    const tagList = tags.map((tag, index) => (
        <Label key={index} >{tag}</Label>
    ));
    
    
    function getRecipeData() {
        React.useEffect(() => {
            Socket.on('recipe page load', (data) => {
                console.log('Received recipe from the server: ' + data["recipe"])
                setRecipe(data['recipe'])
                setIngredients(data['recipe']['ingredients'])
                setInstructions(data['recipe']['instructions'])
                setTags(data['recipe']['tags'])
            })
        });
    }

    function handleSubmit(user){
        Socket.emit('user page', {
            'user_id' : user
        });
        ReactDOM.render(<User />, document.getElementById('content'));
    
    }
    
    getRecipeData()
    return (
        <Container>
            <Header as="h1">{recipe["title"]}</Header>
            <Header size="medium">By : <Button onClick={() => handleSubmit(recipe["user"])}>{recipe["name"]}</Button></Header>
            <Image src={recipe["images"]} size="large" bordered/>
            <Rating maxRating={5} clearable />
            <Icon name="share" />
            <Icon name="bookmark" />
            <Divider/>
            <Header sub>Difficulty: {recipe["difficulty"]}</Header>
            <Header as="h3">Description</Header>
            <Header as="h3">Servings: {recipe["servings"]}</Header>
            <p>
            {ReactHtmlParser(recipe["description"])}
            </p>
            <Header as="h3">Ingredients</Header>
            <List>
                {ingredientList}
            </List>
            <Header as="h3">Instructions</Header>
            <List ordered>
                {instructionsList}
            </List>
            <Header as="h3">Tags</Header>
            <div className="tags">
                {tagList}
            </div>
            
        </Container>
        );
}