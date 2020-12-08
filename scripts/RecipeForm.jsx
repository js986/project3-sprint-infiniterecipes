/* eslint-disable import/no-cycle */
/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
import * as React from 'react';
import ReactDOM from 'react-dom';
import {
  Button, Container, Form, Icon, Header, Divider,
} from 'semantic-ui-react';
import { Content } from './Content';
import { Socket } from './Socket';
import { Recipe } from './Recipe';

const diffOptions = [
  { key: 'easy', text: 'Easy', value: 'easy' },
  { key: 'intermediate', text: 'Intermediate', value: 'intermediate' },
  { key: 'advanced', text: 'Advanced', value: 'advanced' },
];

export function RecipeForm() {
  const [ingredientsField, setIngredientsField] = React.useState([
    { name: '', amount: '', unit: '' },
  ]);
  const [instructionsField, setInstructionsField] = React.useState([
    { step: '' },
  ]);

  const [tagsField, setTagsField] = React.useState([
    { tag: '' },
  ]);

  const [recipe, setRecipe] = React.useState({});
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [servings, setServings] = React.useState('');
  const [image, setImage] = React.useState('');
  const [video, setVideo] = React.useState('');
  const [difficulty, setDifficulty] = React.useState('');
  const [time, setTime] = React.useState('');

  function onChangeIngredientInput(index, event) {
    const values = [...ingredientsField];
    values[index][event.target.name] = event.target.value;
    setIngredientsField(values);
  }

  function onChangeInstructionInput(index, event) {
    const values = [...instructionsField];
    values[index][event.target.name] = event.target.value;
    setInstructionsField(values);
  }

  function onChangeTagInput(index, event) {
    const values = [...tagsField];
    values[index][event.target.name] = event.target.value;
    setTagsField(values);
  }

  function removeTagsField(index, event) {
    const remObj = tagsField[index];
    if (index > 0) {
      setTagsField(instructionsField.filter((item) => item !== remObj));
    }
  }

  function removeInstructionsField(index, event) {
    const remObj = instructionsField[index];
    if (index > 0) {
      setInstructionsField(instructionsField.filter((item) => item !== remObj));
    }
  }

  function removeIngredientsField(index, event) {
    const remObj = ingredientsField[index];
    if (index > 0) {
      setIngredientsField(ingredientsField.filter((item) => item !== remObj));
    }
  }

  const ingredientsVals = ingredientsField.map((ingredient, index) => (
    <Form.Group key={index}>
      <Form.Field
        required
        name="name"
        label="Name"
        control="input"
        type="text"
        value={ingredient.name}
        onChange={(event) => onChangeIngredientInput(index, event)}
      />
      <Form.Field
        required
        label="Amount"
        name="amount"
        control="input"
        type="number"
        value={ingredient.amount}
        onChange={(event) => onChangeIngredientInput(index, event)}
      />
      <Form.Field
        label="Unit"
        name="unit"
        control="input"
        type="text"
        value={ingredient.unit}
        onChange={(event) => onChangeIngredientInput(index, event)}
      />
      <Button icon="minus" onClick={(event) => removeIngredientsField(index, event)} />
    </Form.Group>
  ));

  const instructionVals = instructionsField.map((instruction, index) => (
    <Form.Group key={index}>
      <Form.Field
        required
        name="step"
        label="Instruction Name"
        control="input"
        type="text"
        value={instruction.step}
        onChange={(event) => onChangeInstructionInput(index, event)}
      />
      <Button icon="minus" onClick={(event) => removeInstructionsField(index, event)} />
    </Form.Group>
  ));

  const tagVals = tagsField.map((tag, index) => (
    <Form.Group key={index}>
      <Form.Field
        required
        name="tag"
        label="Tag Name"
        control="input"
        type="text"
        value={tag.tag}
        onChange={(event) => onChangeTagInput(index, event)}
      />
      <Button icon="minus" onClick={(event) => removeTagsField(index, event)} />
    </Form.Group>
  ));

  function getForkRecipeData() {
    React.useEffect(() => {
      Socket.on('load fork page', (data) => {
        setRecipe(data.recipe);
        setTitle(data.recipe.title);
        setDescription(data.recipe.description);
        setServings(data.recipe.servings);
        setImage(data.recipe.images);
        setDifficulty(data.recipe.difficulty);
        setTime(data.recipe.readyInMinutes);
        setIngredientsField(data.recipe.ingredients);
        setInstructionsField(data.recipe.instructions);
        //   setTagsField(data.recipe.tags);
      });
      //   console.log("recipe title: " + data);
    });
  }

  function submitForm(e) {
    e.preventDefault();
    Socket.emit('new recipe', {
      name: title,
      servings,
      readyInMinutes: time,
      difficulty,
      description,
      image: [image],
      video: [video],
      ingredients: ingredientsField,
      instructions: instructionsField,
      tags: tagsField,
      user: localStorage.getItem('user_email'),
    });
    Socket.emit('content page', {
      'content page': 'content page',
    });
    ReactDOM.render(<Content />, document.getElementById('content'));
  }

  function changeTitle(event) {
    setTitle(event.target.value);
  }

  function changeTime(event) {
    setTime(event.target.value);
  }

  function changeServings(event) {
    setServings(event.target.value);
  }

  function changeDifficulty(event, { value }) {
    setDifficulty(value);
  }

  function changeDescription(event) {
    setDescription(event.target.value);
  }

  function changeImage(event) {
    setImage(event.target.value);
  }

  function changeVideo(event) {
    setVideo(event.target.value);
  }

  function addIngredientField() {
    setIngredientsField([...ingredientsField, { name: '', amount: '', unit: '' }]);
  }

  function addInstruction() {
    setInstructionsField([...instructionsField, { step: '' }]);
  }

  function addTag() {
    setTagsField([...tagsField, { tag: '' }]);
  }

  function goToHomePage() {
    Socket.emit('content page', {
      'content page': 'content page',
    });
    ReactDOM.render(<Content />, document.getElementById('content'));
  }

  function goToRecipe(id) {
    Socket.emit('recipe page', {
      id,
    });
    ReactDOM.render(<Recipe />, document.getElementById('content'));
  }

  getForkRecipeData();

  const paperback = {
    backgroundImage: "url('https://cdn.hipwallpaper.com/i/92/52/vZp6xG.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
  };

  const titlestyle = {
    fontFamily: 'Comic Sans MS',
    fontSize: '24px',
  };

  const desc = {
    fontFamily: 'Georgia',
    fontSize: '17px',
  };

  const greenbutton = {
    backgroundColor: '#BDB76B',
    border: 'none',
    color: 'white',
    fontFamily: 'Georgia',
    fontSize: '17px',
  };

  return (
    <div style={paperback}>
      <Container>
        <br />
        <Button icon labelPosition="left" onClick={goToHomePage} style={greenbutton}>
          <Icon name="left arrow" />
          Back to Homepage
        </Button>
        <Button icon labelPosition="left" onClick={() => goToRecipe(recipe.id)} style={greenbutton}>
          <Icon name="left arrow" />
          Back to Recipe
        </Button>
        <Header as="h1" style={titlestyle}>Post Recipe</Header>
        <Divider />
        <Form onSubmit={submitForm} style={desc}>
          <Form.Group>
            <Form.Input
              required
              label="Recipe Name"
              placeholder="Recipe Name"
              value={title}
              onChange={changeTitle}
            />
            <Form.Select
              required
              label="Difficulty"
              options={diffOptions}
              value={difficulty}
              placeholder="Difficulty"
              onChange={changeDifficulty}
            />
            <Form.Field
              required
              label="Time"
              control="input"
              type="number"
              value={time}
              onChange={changeTime}
            />
            <Form.Field
              required
              label="Servings"
              control="input"
              type="number"
              value={servings}
              onChange={changeServings}
            />
          </Form.Group>
          <Form.Group>
            <Form.Input
              required
              label="Image URL"
              placeholder="Enter image URL"
              value={image}
              onChange={changeImage}
            />
            <Form.Input
              label="Youtube Video URL"
              placeholder="Format : https://www.youtube.com/watch?v=xxxxxxxx"
              value={video}
              onChange={changeVideo}
              style={{ width: '520px' }}
            />
          </Form.Group>
          <Form.Field>
            <Form.TextArea
              label="Description"
              placeholder="Enter recipe description here..."
              value={description}
              onChange={changeDescription}
            />
          </Form.Field>
          <Header>Ingredients</Header>
          {ingredientsVals}
          <Button onClick={addIngredientField} icon>
            <Icon name="plus" />
            {' '}
            Add Ingredient
          </Button>
          <Header>Instructions</Header>
          {instructionVals}
          <Button onClick={addInstruction} icon>
            <Icon name="plus" />
            {' '}
            Add Instruction
          </Button>
          <Header>Tags</Header>
          {tagVals}
          <Button onClick={addTag} icon>
            <Icon name="plus" />
            {' '}
            Add Tag
          </Button>
          <br />
          <br />
          <br />
          <Button type="submit" positive>Post Recipe</Button>
        </Form>
      </Container>
    </div>
  );
}
