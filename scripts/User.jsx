/* eslint-disable import/no-cycle, react/no-array-index-key */
import * as React from 'react';
import ReactDOM from 'react-dom';
import {
  Container, Button, Icon, Image, Card,
} from 'semantic-ui-react';
import ReactHtmlParser from 'react-html-parser';
import { Socket } from './Socket';
import { Recipe } from './Recipe';
import { Content } from './Content';

export function User() {
  const [users, setUsers] = React.useState({});
  const [ownedRecipes, setOwnedRecipes] = React.useState([]);
  const [savedRecipes, setSavedRecipes] = React.useState([]);

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
      });
    });
  }

  function goToHomePage() {
    Socket.emit('content page', {
      'content page': 'content page',
    });
    ReactDOM.render(<Content />, document.getElementById('content'));
  }

  function goToRecipe(event,index) {
    event.preventDefault();
    const { id } = ownedRecipes[index];
    Socket.emit('recipe page', {
      id,
    });
    ReactDOM.render(<Recipe />, document.getElementById('content'));
  }

  getUserData();
  return (
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
        <h2> {users.name}'s Recipes </h2>
        <Card.Group itemsPerRow={6}>
          {ownedList}
        </Card.Group>
      </div>
      <div>
        <h2> Shared Recipes </h2>
      </div>
      <div>
        <h2> Saved Recipes </h2>
        <Card.Group itemsPerRow={6}>
          {savedList}
        </Card.Group>
      </div>
    </Container>
  );
}
