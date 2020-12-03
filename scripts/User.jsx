/* eslint-disable import/no-cycle, react/no-array-index-key */
import * as React from 'react';
import ReactDOM from 'react-dom';
import {
  Container, Button, Icon, Image, Card, Divider,
} from 'semantic-ui-react';
import ReactHtmlParser from 'react-html-parser';
import { Socket } from './Socket';
import { Recipe } from './Recipe';
import { Content } from './Content';

export function User() {
  const [users, setUsers] = React.useState({});
  const [ownedRecipes, setOwnedRecipes] = React.useState([]);
  const [savedRecipes, setSavedRecipes] = React.useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = React.useState([]);

  //  const numbersAgain=numbers.toString();
  // console.log("These are owned recipes again "+ numbersAgain)

  //   const ownedList = owned_recipes.map((solo, index) => (
  //       <Label key={index} > {solo}</Label>
  //    ));

  function handleSubmit(event, index) {
    event.preventDefault();
    const { id } = savedRecipes[index];
    Socket.emit('recipe page', {
      id,
    });
    ReactDOM.render(<Recipe />, document.getElementById('content'));
  }

  const savedList = savedRecipes.map((savedRecipe, index) => (
    <Card key={index} onClick={(event) => handleSubmit(event, index)}>
      <Image src={savedRecipe.images[0]} wrapped ui={false} />
      <Card.Content>
        <Card.Header>{savedRecipe.title}</Card.Header>
        <Card.Meta>
          <span className="username">
            By:
            {savedRecipe.name}
          </span>
        </Card.Meta>
        <Card.Description>
          <span className="description">{ReactHtmlParser(savedRecipe.description)}</span>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <span className="difficulty">{savedRecipe.difficulty}</span>
      </Card.Content>
    </Card>

  ));
  
    const favoritedList = favoriteRecipes.map((favoriteRecipe, index) => (
    <Card key={index} onClick={(event) => handleSubmit(event, index)}>
      <Image src={favoriteRecipe.images[0]} wrapped ui={false} />
      <Card.Content>
        <Card.Header>{favoriteRecipe.title}</Card.Header>
        <Card.Meta>
          <span className="username">
            By:
            {favoriteRecipe.name}
          </span>
        </Card.Meta>
        <Card.Description>
          <span className="description">{ReactHtmlParser(favoriteRecipe.description)}</span>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <span className="difficulty">{favoriteRecipe.difficulty}</span>
      </Card.Content>
    </Card>

  ));
  
  const ownedList = ownedRecipes.map((ownedRecipe, index) => (
    <Card key={index} onClick={(event) => goToRecipe(event, index)}>
      <Image src={ownedRecipe.images[0]} wrapped ui={false} />
      <Card.Content>
        <Card.Header>{ownedRecipe.title}</Card.Header>
        <Card.Meta>
          <span className="username">
            By:
            {ownedRecipe.name}
          </span>
        </Card.Meta>
        <Card.Description>
          <span className="description">{ReactHtmlParser(ownedRecipe.description)}</span>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <span className="difficulty">{ownedRecipe.difficulty}</span>
      </Card.Content>
    </Card>

  ));

  function getUserData() {
    React.useEffect(() => {
      Socket.on('user page load', (data) => {
        setUsers(data.user);
        setOwnedRecipes(data.owned_recipes);
        setSavedRecipes(data.saved_recipes);
        setFavoriteRecipes(data.favorite_recipes);
      });
    });
  }

  function goToHomePage() {
    Socket.emit('content page', {
      'content page': 'content page',
    });
    ReactDOM.render(<Content />, document.getElementById('content'));
  }

  function goToRecipe(event, index) {
    event.preventDefault();
    const { id } = ownedRecipes[index];
    Socket.emit('recipe page', {
      id,
    });
    ReactDOM.render(<Recipe />, document.getElementById('content'));
  }

  getUserData();
  
  var paperback = {
    backgroundImage:"url('https://cdn.hipwallpaper.com/i/92/52/vZp6xG.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    margin:'0'
  }
  var title = {
    fontFamily: 'Comic Sans MS'
  }
  return (
    <div  style={paperback}>
    <Container>
      <Button icon labelPosition="left" onClick={goToHomePage}>

        <Icon name="left arrow" />
        Back to Homepage
      </Button>
      {' '}
      <br />
      {' '}
      <br />
      <Image src={users.profile_pic} />
      <h3>
        {' '}
        {users.name}
        {' '}
      </h3>
      <h3>
        {users.email}
        {' '}
      </h3>
      <div className="tags">
        <h2 style={title}> {users.name}'s Recipes </h2>
        <Divider/>
        <Card.Group itemsPerRow={6}>
          {ownedList}
        </Card.Group>
      </div>
      <div className="favorite-recipes">
        <h2 style={title}> Favorite Recipes </h2>
        <Divider />
        <Card.Group itemsPerRow={6}>
          {favoritedList}
        </Card.Group>
      </div>
      <div className="saved-recipes">
        <h2 style={title}> Saved Recipes </h2>
        <Divider />
        <Card.Group itemsPerRow={6}>
          {savedList}
        </Card.Group>
      </div>
    </Container>
    </div>
  );
}
