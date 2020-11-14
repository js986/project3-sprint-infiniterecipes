import * as React from 'react';
import { Socket } from './Socket';

function handleSubmit(event) {
    let newSearch = document.getElementById("search_input");
    if (newSearch === "" || newSearch === null || newSearch === undefined){
        return;
    }
    Socket.emit('new search input', {
        'search': newSearch.value,
    });
    
    console.log('Sent the search ' + newSearch.value + ' to server!');
    newSearch.value = ''
    
    event.preventDefault();
}

var inputbox = {
    width: '67%',
    padding: '10px 20px',
    margin: '8px',
    display: 'inline-block',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
}

var submitbox = {
  width: '13%',
  backgroundColor: '#778899',
  color: 'white',
  padding: '10px 20px',
  margin: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  cursor: 'pointer',
}


export function SearchButton() {
    return (
        <form onSubmit={handleSubmit}>
            <input id="search_input" placeholder="Search for recipes here by ingredient, meal-type, cuisine, difficulty" style={inputbox}></input>
            <button style={submitbox}>SEARCH</button>
        </form>
    );
}
