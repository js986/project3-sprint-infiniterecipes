import * as React from 'react';
import { Socket } from './Socket';

function handleSubmit(event) {
    let newSearch = document.getElementById("search_input");
    Socket.emit('new search input', {
        'search': newSearch.value,
    });
    
    console.log('Sent the search ' + newSearch.value + ' to server!');
    newSearch.value = ''
    
    event.preventDefault();
}

export function SearchButton() {
    return (
        <form onSubmit={handleSubmit}>
            <input id="search_input" placeholder="Search for recipes here by ingredient, meal-type, cuisine, difficulty"></input>
            <button>SEARCH</button>
        </form>
    );
}
