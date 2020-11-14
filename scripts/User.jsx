import * as React from 'react';
import ReactDOM from 'react-dom';
import { Socket } from './Socket';
import { Container, Header, Divider, Rating, Button, Icon, Image, List, Label } from 'semantic-ui-react';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { Recipe } from './Recipe';
import { Content } from './Content';

export function User() {
    const [users, setUsers] = React.useState({});
    const [owned_recipes,setowned_recipes] = React.useState([]);
    
  //  const numbersAgain=numbers.toString(); 
  // console.log("These are owned recipes again "+ numbersAgain)
    
 //   const ownedList = owned_recipes.map((solo, index) => (
 //       <Label key={index} > {solo}</Label>
//    ));
    
    
    function getUserData() {
        React.useEffect(() => {
            Socket.on('user page load', (data) => {
                console.log('Received user from the server: ' + data["user"]);
                 setUsers(data['user'])
                 setowned_recipes(data['user']['owned_recipes'])
                
            })
        });
    }
    
    function goToHomePage(){
        Socket.emit('content page', {
            'content page' : 'content page'
        });
        ReactDOM.render(<Content />, document.getElementById('content'));
    }
    
   function goToRecipe(solo){
        Socket.emit('recipe page', {
            'id' : solo['solo']
        });
        ReactDOM.render(<Recipe />, document.getElementById('content'));
    }
    
    getUserData();
    return ( 
       <Container>
            <Button icon labelPosition="left" onClick={goToHomePage}>
            <Icon name="left arrow" />
            Back to Homepage
            </Button> <br /> <br />
            <Image src={users["profile_pic"]} />
            <h3> {users["name"]} </h3>
            <h3>{users["email"]} </h3>
            <div className="tags">  
                <h2> Your Recipes </h2>
                <ul style={{listStyleType:"none"}}>
                {
                    owned_recipes.map((solo, index) => (
                    <li><button onClick={() => goToRecipe({solo})}> {solo} </button></li>
                    ),
                    )
                }
                </ul>
            </div>
            <div>
                <h2> Shared Recipes </h2>
            </div>
            <div>
                <h2> Saved Recipes </h2>
            </div>
        </Container>
        );
}