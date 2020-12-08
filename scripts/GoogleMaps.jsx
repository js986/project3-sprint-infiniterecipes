/* eslint-disable import/prefer-default-export, react/button-has-type */
import * as React from 'react';
import { Socket } from './Socket';

function zipSubmit(event) {
  const newZip = document.getElementById('zip_code');
  Socket.emit('new zipcode query', {
    zip: newZip.value,
  });
  newZip.value = '';

  event.preventDefault();
}

export function GoogleMaps() {
  const submitbox = {
    width: '13%',
    backgroundColor: '#BDB76B',
    color: 'white',
    padding: '10px 20px',
    margin: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const inputbox = {
    width: '30%',
    padding: '10px 20px',
    margin: '8px',
    display: 'inline-block',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
  };
  return (
    <form onSubmit={zipSubmit}>
      <input id="zip_code" placeholder="Enter your zipcode (#####)" style={inputbox} />
      <button style={submitbox}> Find local stores </button>
    </form>
  );
}
