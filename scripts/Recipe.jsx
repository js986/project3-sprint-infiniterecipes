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
  
  var paperback = {
    backgroundImage:"url('https://cdn.hipwallpaper.com/i/92/52/vZp6xG.jpg')",
    // backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    backgroundAttachment: 'fixed'
  }
  
  var greenbutton = {
    backgroundColor: '#BDB76B',
    border: 'none',
    color: 'white',
    fontFamily: 'Georgia',
    fontSize: '17px'
  }
  
  var redbutton = {
    backgroundColor: '#E9967A',
    border: 'none',
    fontFamily: 'Georgia',
    fontSize: '17px'
  }
  
  var plainbutton = {
    fontFamily: 'Georgia',
    fontSize: '17px'
  }
  
  var stars = {
    backgroundColor: '#BDB76B',
    border: 'none'
  }
  
  var title = {
    fontFamily: 'Comic Sans MS'
  }
  
  var desc = {
    fontFamily: 'Georgia',
    fontSize: '16px'
  }
  
  return (
    <div  style={paperback}>
    <Container>
      <Button icon labelPosition="left" onClick={goToHomePage} style={plainbutton}>
        <Icon name="left arrow" />
        Back to Homepage
      </Button>
      <Divider />
      <Header as="h1" style={title}>{recipe.title}</Header>
      <Header size="medium">
        By: 
        <Button style={redbutton} onClick={() => handleSubmit(recipe.user)}>{recipe.name}</Button>
      </Header>
      <Image src={recipe.images} size="large" bordered />
      <Rating className="rating" maxRating={5} clearable size="huge" style={stars} />
      <Button.Group className="action-buttons" size="large" basic style={greenbutton}>
        <Button className="favorite-button" icon="favorite" onClick={favoriteRecipe}/>
        <Button className="bookmark-button" icon="bookmark" onClick={saveRecipe} />
      </Button.Group>
      &emsp; &emsp; &emsp; &emsp; &emsp; 
      <Button  animated='fade' style={greenbutton}>
        <Button.Content visible icon labelPosition="right">Fork this Recipe</Button.Content>
        <Button.Content hidden onClick={() => forkRecipe(recipe.id)}>What's your way</Button.Content>
      </Button>
      <Divider />
      <Header sub style={desc}>
        Difficulty:
        {recipe.difficulty}
      </Header>
      <Header sub style={desc}>
        Servings:
        {recipe.servings}
      </Header>
      <Header sub style={desc}>
        Time:
        {recipe.readyInMinutes}
        {' '}
        Min
      </Header>
      <Header as="h3">Description</Header>
      <p style={desc}>
        {ReactHtmlParser(recipe.description)}
      </p>
      <Header as="h3">Ingredients</Header>
      <List celled style={desc}>
        {ingredientList}
      </List>
      <Button  animated='fade' style={greenbutton}>
        <Button.Content visible>Add Ingredients to Cart</Button.Content>
        <Button.Content hidden onClick={() => addToCart(recipe.ingredients)}><Icon name="in cart" /></Button.Content>
      </Button>
      <Header as="h3">Instructions</Header>
      <List ordered style={desc}>
        {instructionsList}
      </List>
      <Header as="h3">Tags</Header>
      <div className="tags" style={plainbutton}>
        {tagList}
      </div>
      <br />
    </Container>
    </div>
  );
}
