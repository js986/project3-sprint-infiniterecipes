/* eslint-disable import/no-cycle, react/no-array-index-key */
/* eslint-disable import/prefer-default-export, jsx-a11y/iframe-has-title */
import * as React from 'react';
import ReactDOM from 'react-dom';
import {
  Container, Header, Divider, Button, Icon, List, Segment,
} from 'semantic-ui-react';
import { Socket } from './Socket';
import { Content } from './Content';
import { GoogleMaps } from './GoogleMaps';

export function Cart() {
  const [items, setItems] = React.useState([]);
  const [empty, setEmpty] = React.useState(true);
  const [zip, setZip] = React.useState('07101');

  const itemList = items.map((item, index) => (
    <List.Item key={index}>{item}</List.Item>
  ));

  function updateCart() {
    React.useEffect(() => {
      Socket.on('cart items received', (data) => {
        if (data.cartItems.length > 0) {
          setItems(data.cartItems);
          setEmpty(false);
        }
      });
    });
  }

  function goToHomePage() {
    Socket.emit('content page', {
      'content page': 'content page',
    });
    ReactDOM.render(<Content />, document.getElementById('content'));
  }

  function newZip() {
    React.useEffect(() => {
      Socket.on('new zip', (zipcode) => {
        setZip(zipcode);
      });
    });
  }

  const mapSource = `https://www.google.com/maps/embed/v1/search?key=AIzaSyBHFI3RHOOfCQbhPZErlWusp26rVJJWsGw&q=grocery+store+near+${
    zip}`;

  updateCart();
  newZip();

  const paperback = {
    backgroundImage: "url('https://cdn.hipwallpaper.com/i/92/52/vZp6xG.jpg')",
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'no-repeat',
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
        <Button icon labelPosition="left" onClick={goToHomePage} style={greenbutton}>
          <Icon name="left arrow" />
          Back to Homepage
        </Button>
        <Segment>
          <Header as="h1" style={titlestyle}>Your Items:</Header>
          <Divider />
          { empty === true ? <Header as="h2" style={desc}>Your cart is empty</Header> : <List divided verticalAlign="middle">{itemList}</List>}
        </Segment>
        <br />
        <br />
        <br />
        <h1 style={titlestyle}> Find A Grocery Store Near You </h1>
        <GoogleMaps />
        <h4 style={desc}> NOTE: If zipcode is invalid, the map will not update </h4>
        <iframe
          width="600"
          height="450"
          frameBorder="0"
          zoom="15"
          src={mapSource}
          allowFullScreen
        />
        <br />
        <br />
      </Container>
    </div>
  );
}
