import * as React from 'react';
import { Container, Header, Divider, Rating, Button, Icon, Image, List, Label } from 'semantic-ui-react';


export default function Recipe({ username, picture, title, id, ingredients, instructions, tags, readyInMinutes, servings, sourceUrl, description, comments, rating}) {
    
    const ingredientList = ingredients.map((ingredient, index) => (
        <List.Item>{ingredient}</List.Item>
    ));
    
    const instructionsList = instructions.map((instruction, index) => (
        <List.Item>{instruction}</List.Item>
    ));
    
    const tagList = tags.map((tag) => (
        <Label>{tag}</Label>
    ));
    
    return (
        <Container>
            <Header as="h1">{title}</Header>
            <Header size="medium">By : {username}</Header>
            <Image src={picture} size="large" rounded/>
            <Rating maxRating={5} clearable />
            <Icon name="share" />
            <Icon name="bookmark" />
            <Divider/>
            <Header sub>Difficulty: </Header>
            <Header as="h3">Description</Header>
            <p>{description}</p>
            <Header as="h3">Ingredients</Header>
            <List>
                {ingredientList}
            </List>
            <Header as="h3">Instructions</Header>
            <List>
                {instructionsList}
            </List>
            <Header as="h3">Tags</Header>
            <div className="tags">
                {tagList}
            </div>
            <CommentList comments={comments} />
            
        </Container>
        );
}