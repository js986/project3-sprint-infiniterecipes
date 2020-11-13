import * as React from 'react';
import ReactDOM from 'react-dom';
import { Container, Header, Divider, Button, Icon, List} from 'semantic-ui-react';
import { Socket } from './Socket';
import { Content } from './Content';
import { GoogleMaps } from './GoogleMaps';

export function Cart() {
    const [items,setItems] = React.useState([]);
    const [empty, setEmpty] = React.useState(true);
    const [zip, setZip] = React.useState('07101');
    
    const itemList = items.map((item,index) => (
        <List.Item key={index}>{item["name"]}</List.Item>
    ));
    
    function updateCart(){
        React.useEffect(() => {
            Socket.on('cart items received',(data) => {
                console.log("Received items from server: " + data["cartItems"]);
                setItems(data['cartItems']);
                setEmpty(false);
            })
        })
    }
    
    function goToHomePage(){
        Socket.emit('content page', {
            'content page' : 'content page'
        });
        ReactDOM.render(<Content />, document.getElementById('content'));
    }
    
    function newZip() {
        React.useEffect(() => { 
            Socket.on('new zip', (zipcode) => {
                console.log("Received a zip from server: " + zipcode);
                setZip(zipcode);
        });
    });
    }
    
    const mapSource=
    "https://www.google.com/maps/embed/v1/search?key=AIzaSyBHFI3RHOOfCQbhPZErlWusp26rVJJWsGw&q=grocery+store+near+"
    + zip;
    
    updateCart();
    newZip();
    
    return (
        <Container>
            <Button icon labelPosition="left" onClick={goToHomePage}>
                <Icon name="left arrow" />
                Back to Homepage
            </Button>
            <Header as="h1">Your Items:</Header>
            <Divider/>
            { empty ? <Header as="h2">Your cart is empty</Header> : <List divided verticalAlign='middle'>{itemList}</List>
            }
            <br />
            <br />
            <br />
            <h1> Find A Grocery Store Near You </h1>
            <GoogleMaps />
            <h4> NOTE: If zipcode is invalid, the map will not update </h4>
            <iframe
      	        width="600"
      	        height="450"
      	        frameBorder="0"
      	        zoom = "15"
      	        src= {mapSource} allowFullScreen>
    	    </iframe>
        </Container>
        
    )
}