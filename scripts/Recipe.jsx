/* eslint-disable import/no-cycle, react/no-array-index-key */
import * as React from 'react';
import ReactDOM from 'react-dom';
import {
  Container, Header, Divider, Rating, Button, Icon, Image, List, Label,
} from 'semantic-ui-react';
import ReactHtmlParser from 'react-html-parser';
import { Socket } from './Socket';
import { Content } from './Content';
import { User } from './User';
import ReactPlayer from "react-player";
import { RecipeForm } from './RecipeForm';


export function Recipe() {
  const [recipe, setRecipe] = React.useState({});
  const [ingredients, setIngredients] = React.useState([]);
  const [instructions, setInstructions] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const regexConst = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

  const ingredientList = ingredients.map((ingredient, index) => (
    <List.Item key={index}>{`${ingredient.amount} ${ingredient.unit} ${ingredient.name}`}</List.Item>
  ));

  const instructionsList = instructions.map((instruction, index) => (
    <List.Item key={index}>{instruction.step}</List.Item>
  ));

  const tagList = tags.map((tag, index) => (
    <Label key={index}>{tag}</Label>
  ));

  function getRecipeData() {
    React.useEffect(() => {
      Socket.on('recipe page load', (data) => {
        setRecipe(data.recipe);
        console.log(data.recipe.video + " VIDEO HERE");
        setIngredients(data.recipe.ingredients);
        setInstructions(data.recipe.instructions);
        setTags(data.recipe.tags);
        console.log('here it is: '+ data.recipe.videos)
      });
    });
  }

  function getCartNumItems() {
    React.useEffect(() => {
      Socket.on('received cart item num', (data) => {
        localStorage.setItem('cartNumItems', data.cart_num);
      });
    });
  }

  function handleSubmit(user) {
    Socket.emit('user page', {
      user_id: user,
    });
    ReactDOM.render(<User />, document.getElementById('content'));
  }

  function saveRecipe() {
    let email = '';
    if (localStorage.getItem('user_email') !== null) {
      email = localStorage.getItem('user_email');
    }
    Socket.emit('save recipe', {
      recipe_id: recipe.id,
      user_email: email,
    });
  }
  
  function favoriteRecipe() {
    let email = '';
    if (localStorage.getItem('user_email') !== null) {
      email = localStorage.getItem('user_email');
    }
    Socket.emit('favorite recipe', {
      recipe_id: recipe.id,
      user_email: email,
    });
  }
  
  

  function addToCart(recipes) {
    let email = '';
    if (localStorage.getItem('user_email') !== null) {
      email = localStorage.getItem('user_email');
    }
    Socket.emit('add to cart', {
      cartItems: recipes,
      user_email: email,
    });
  }

  function goToHomePage() {
    Socket.emit('content page', {
      'content page': 'content page',
    });
    ReactDOM.render(<Content />, document.getElementById('content'));
  }
  
  function forkRecipe(id) {
    Socket.emit('fork page',  {
      'id': id
    });
    console.log("recipe data here: " + recipe.id)
    ReactDOM.render(<RecipeForm />, document.getElementById('content'));
  }

  getRecipeData();
  getCartNumItems();
  return (
    <Container>
      <Button icon labelPosition="left" onClick={goToHomePage}>
        <Icon name="left arrow" />
        Back to Homepage
      </Button>
      <Divider />
      <Header as="h1">{recipe.title}</Header>
      <Header size="medium">
        By: 
        <Button onClick={() => handleSubmit(recipe.user)}>{recipe.name}</Button>
      </Header>
      <Image src={recipe.images} size="large" bordered />
      <Rating className="rating" maxRating={5} clearable size="huge" />
      <Button.Group className="action-buttons" size="large" basic>
        <Button className="favorite-button" icon="favorite" onClick={favoriteRecipe}/>
        <Button className="bookmark-button" icon="bookmark" onClick={saveRecipe} />
      </Button.Group>
      <Button icon labelPosition="right" onClick={() => forkRecipe(recipe.id)}>Fork this Recipe</Button>
      <Divider />
      <Header sub>
        Difficulty:
        {recipe.difficulty}
      </Header>
      <Header sub>
        Servings:
        {recipe.servings}
      </Header>
      <Header sub>
        Time:
        {recipe.readyInMinutes}
        {' '}
        Min
      </Header>
      <Header as="h3">Description</Header>
      <p>
        {ReactHtmlParser(recipe.description)}
      </p>
      <Header as="h3">Ingredients</Header>
      <List celled>
        {ingredientList}
      </List>
      <Button onClick={() => addToCart(recipe.ingredients)}>Add Ingredients to Cart</Button>
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
