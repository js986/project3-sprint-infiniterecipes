/* eslint-disable import/no-cycle, react/no-array-index-key */
/* eslint-disable import/prefer-default-export, jsx-a11y/iframe-has-title */
import * as React from 'react';
import ReactDOM from 'react-dom';
import {
  Container, Header, Divider, Button, Icon, Image, List, Label, Modal, Segment,
} from 'semantic-ui-react';
import ReactHtmlParser from 'react-html-parser';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { nanoid } from 'nanoid';
import { Socket } from './Socket';
import { Content } from './Content';
import { User } from './User';
import { RecipeForm } from './RecipeForm';
import { ImageForm } from './ImageForm';

export function Recipe() {
  const [recipe, setRecipe] = React.useState({});
  const [ingredients, setIngredients] = React.useState([]);
  const [instructions, setInstructions] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [video, setVideo] = React.useState([]);
  const [hasVideo, setHasVideo] = React.useState(false);
  const [slides, setSlides] = React.useState([]);
  const [hasUserImages, setHasUserImages] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalImage, setModalImage] = React.useState('');
  function getRecipeData() {
    React.useEffect(() => {
      Socket.on('recipe page load', (data) => {
        setRecipe(data.recipe);
        setIngredients(data.recipe.ingredients);
        setInstructions(data.recipe.instructions);
        setTags(data.recipe.tags);
        setSlides(data.recipe.user_submitted_images);
        if (data.recipe.user_submitted_images.length > 0) {
          setHasUserImages(true);
        }
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

  function isVideoHere() {
    React.useEffect(() => {
      Socket.on('video available', (data) => {
        setVideo(data);
        setHasVideo(true);
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
    Socket.emit('fork page', {
      id,
    });
    ReactDOM.render(<RecipeForm />, document.getElementById('content'));
  }

  function onChangeModalImage(event) {
    setModalImage(event.target.value);
  }

  function onModalImageSubmit(event) {
    event.preventDefault();
    let email = '';
    if (localStorage.getItem('user_email') !== null) {
      email = localStorage.getItem('user_email');
      Socket.emit('new recipe user image', {
        image: modalImage,
        recipe_id: recipe.id,
        user_email: email,
      });
    }
    setModalImage('');
    setModalOpen(false);
  }
  const videoSource = `https://www.youtube.com/embed/${video}`;

  getRecipeData();
  getCartNumItems();
  isVideoHere();

  const paperback = {
    backgroundImage: "url('https://cdn.hipwallpaper.com/i/92/52/vZp6xG.jpg')",
    // backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    backgroundAttachment: 'fixed',
  };

  const greenbutton = {
    backgroundColor: '#BDB76B',
    border: 'none',
    color: 'white',
    fontFamily: 'Georgia',
    fontSize: '17px',
  };

  const redbutton = {
    backgroundColor: '#E9967A',
    border: 'none',
    fontFamily: 'Georgia',
    fontSize: '17px',
  };

  const plainbutton = {
    fontFamily: 'Georgia',
    fontSize: '17px',
  };

  const title = {
    fontFamily: 'Georgia',
  };

  const desc = {
    fontFamily: 'Georgia',
    fontSize: '16px',
  };

  const ingredientList = ingredients.map((ingredient) => (
    <List.Item key={nanoid()}>{`${ingredient.amount} ${ingredient.unit} ${ingredient.name}`}</List.Item>
  ));

  const instructionsList = instructions.map((instruction) => (
    <List.Item key={nanoid()}>{instruction.step}</List.Item>
  ));

  const tagList = tags.map((tag) => (
    <Label key={nanoid()}>{tag}</Label>
  ));

  const slidesList = slides.map((slide) => (
    <div>
      <Image as="img" className="slide-image" src={slide} inline wrapped />
    </div>
  ));

  return (
    <div style={paperback}>
      <Container>
        <Button icon labelPosition="left" onClick={goToHomePage} style={greenbutton}>
          <Icon name="left arrow" />
          Back to Homepage
        </Button>
        <Divider />
        <Header as="h1" style={title}>{recipe.title}</Header>
        <Header size="medium">
          By:
          <Button style={redbutton} onClick={() => handleSubmit(recipe.user)}>{recipe.name}</Button>
        </Header>
        <div id="recipeImage">
          <Image src={recipe.images} size="large" bordered />
        </div>
        <br />
        { hasVideo === true
          ? (
            <div id="youtubeVideo">
              <iframe
                width="415"
                height="235"
                src={videoSource}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )
          : (<div> </div>
          )}
        <br />
        <Button.Group className="action-buttons" size="large" basic style={greenbutton}>
          <Button className="favorite-button" icon="favorite" onClick={favoriteRecipe} />
          <Button className="bookmark-button" icon="bookmark" onClick={saveRecipe} />
        </Button.Group>
      &emsp; &emsp; &emsp; &emsp; &emsp;
        <Button animated="fade" style={greenbutton}>
          <Button.Content visible icon labelPosition="right">Fork this Recipe</Button.Content>
          <Button.Content
            hidden
            onClick={() => forkRecipe(recipe.id)}
          >
            What&apos;s your way
          </Button.Content>
        </Button>
        <br />
        <br />
        <Divider />
        <Segment>
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
          <Button animated="fade" style={greenbutton}>
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
        </Segment>
        <Divider />
        <Header style={desc}>
          How
          {' '}
          {recipe.title}
          {' '}
          looked for other users:
        </Header>
        <div className="finished-dish-slider">
          { hasUserImages === true
            ? (
              <Carousel>
                {slidesList}
              </Carousel>
            ) : (<Header>Be the first to add your finished dish!</Header>
            )}
          <Modal
            onClose={() => setModalOpen(false)}
            onOpen={() => setModalOpen(true)}
            open={modalOpen}
            trigger={<Button style={greenbutton}>Post finished dish</Button>}
          >
            <Modal.Header>Enter an image url:</Modal.Header>
            <Modal.Content>
              <ImageForm
                value={modalImage}
                onChange={onChangeModalImage}
                handleClose={onModalImageSubmit}
              />
            </Modal.Content>
          </Modal>
        </div>
      </Container>
    </div>
  );
}
