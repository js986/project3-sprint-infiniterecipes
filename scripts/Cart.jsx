import * as React from 'react';
import ReactDOM from 'react-dom';
import { Container, Header, Divider, Button, Icon, List} from 'semantic-ui-react';
import { Socket } from './Socket';
import { Content } from './Content';

export function Cart() {
    const [items,setItems] = React.useState([]);
    const [empty, setEmpty] = React.useState(true);
    
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
    
    updateCart();
    
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
        </Container>
        
    )
}