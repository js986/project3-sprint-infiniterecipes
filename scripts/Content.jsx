/* eslint-disable import/no-cycle */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import ReactDOM from 'react-dom';

import {
  Card, Button, Image, Container, Header, Label, Icon,
} from 'semantic-ui-react';
import ReactHtmlParser from 'react-html-parser';
import { SearchButton } from './SearchButton';
import { Socket } from './Socket';
import { GoogleButton } from './GoogleButton';
import { LogoutButton } from './LogoutButton';
import { Recipe } from './Recipe';
import { Cart } from './Cart';
import { RecipeForm } from './RecipeForm';
import { User } from './User';
// import { RecipeVideo } from './RecipeVideo';
import ReactPlayer from "react-player";
import { ForkRecipe } from './ForkRecipe';

export function Content() {
  const [recipe, setRecipe] = React.useState({});
  const [ingredients, setIngredients] = React.useState([]);
  const [instructions, setInstructions] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [recipes, setRecipes] = React.useState([]);
  const [guser, setGUser] = React.useState([]);
  const [isloggedin, setIsloggedin] = React.useState(false);
  const [cartNumItems, setCartNumItems] = React.useState(0);
  let recipeImages;

  function getNewRecipes() {
    React.useEffect(() => {
      Socket.on('recipes received', (data) => {
        setRecipes(data.all_display);
        if (localStorage.getItem('cartNumItems') !== null) {
          setCartNumItems(localStorage.getItem('cartNumItems'));
        }
      });
    });
  }

  function updateLogin() {
    React.useEffect(() => {
      Socket.on('logged in', (data) => {
        localStorage.setItem('user_email', data.email);
        localStorage.setItem('cartNumItems', data.cartNumItems);
        setGUser(data.username);
        setCartNumItems(data.cartNumItems);
        setIsloggedin(true);
      });
    });
  }

  function updateLogout() {
    React.useEffect(() => {
      Socket.on('logged out', (data) => {
        // setGUser(data['username']);
        localStorage.removeItem('user_email');
        localStorage.removeItem('cartNumItems');
        setCartNumItems(0);
        setIsloggedin(false);
      });
    });
  }

  function updateRecipes() {
    React.useEffect(() => {
      Socket.on('search results received', (data) => {
        setRecipes(data.search_output);
        setIngredients(data.recipe.ingredients);
        setInstructions(data.recipe.instructions);
        setTags(data.recipe.tags);
      });
    });
  }

  function handleSubmit(id) {
    Socket.emit('recipe page', {
      id,
    });
    ReactDOM.render(<Recipe />, document.getElementById('content'));
  }

  function goToCart() {
    Socket.emit('cart page', {
      user_email: localStorage.getItem('user_email'),
    });
    ReactDOM.render(<Cart />, document.getElementById('content'));
  }

  function goToForm() {
    ReactDOM.render(<RecipeForm />, document.getElementById('content'));
  }
  
  function goToUser(user) {
    Socket.emit('user page', {
      user_id: user,
    });
    ReactDOM.render(<User />, document.getElementById('content'));
  }
  
  function getRecipeData() {
    React.useEffect(() => {
      Socket.on('recipe page load', (data) => {
        setRecipe(data.recipe);
      });
    });
  }

  getNewRecipes();
  updateRecipes();
  updateLogin();
  updateLogout();
  getRecipeData();

  const recipeList = recipes.map((recipe, index) => (
    <Card key={index} onClick={() => handleSubmit(recipe.id)}>
      <Image src={recipe.images[0]} wrapped ui={false} />
      <Card.Content>
        <Card.Header>{recipe.title}</Card.Header>
        <Card.Meta>
          <span className="username">
            By:
            {recipe.name}
          </span>
        </Card.Meta>
        <Card.Description>
          <span className="description">{ReactHtmlParser(recipe.description)}</span>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <span className="difficulty">{recipe.difficulty}</span>
      </Card.Content>
    </Card>
  ));

  return (
    <Container>
      <div>
        <p>
          {' '}
          <a href="about">About Us</a>
        </p>
        <h1>InfiniteRecipes!</h1>

        <br />
        <div>
          <Button as="div" labelPosition="right">
            <Button floated="left" onClick={goToCart}>
              <Icon name="cart" />
              <Label color="red" pointing="left">
                {cartNumItems}
              </Label>
            </Button>
          </Button>
          { isloggedin === true
            ? (
              <div className="loggedIn-buttons">
                <Button floated="right" onClick={goToForm}>POST</Button>
                <Button floated="right" onClick={() => goToUser(guser)}>{guser}</Button>
                <br />
                <br />
                <br />
                <Header as="h2" floated="right"><LogoutButton /></Header>
              </div>
            )
            : (
              <div className="google-login-button">
                <GoogleButton />
              </div>
            )}
        </div>
        <br />
        <br />
        <br />
        <div>
          <center><SearchButton /></center>
          <br/>
        </div>
        <br />
        <Card.Group itemsPerRow={5}>
          {recipeList}
        </Card.Group>
        <br />
      </div>
    </Container>
  );
}
