/* eslint-disable import/prefer-default-export, react/button-has-type */
import * as React from 'react';
import { Socket } from './Socket';

function handleSubmit(event) {
  const newSearch = document.getElementById('search_input');
  const filter = document.getElementById('filtered_search');
  if (newSearch.value === '' || newSearch.value === null || newSearch.value === undefined) {
    return;
  }
  Socket.emit('new search input', {
    search: newSearch.value,
    filter: filter.value,
  });

  newSearch.value = '';

  event.preventDefault();
}

const inputbox = {
  width: '67%',
  padding: '10px 20px',
  margin: '8px',
  display: 'inline-block',
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxSizing: 'border-box',
};

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

const selectbox = {
  width: '11%',
  backgroundColor: '#BDB76B',
  color: 'white',
  padding: '10px 20px',
  margin: '9px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  cursor: 'pointer',
};

export function SearchButton() {
  return (
    <form onSubmit={handleSubmit}>
      <input id="search_input" placeholder="Search for recipes here by name, tag, difficulty" style={inputbox} />

      <select style={selectbox} name="filtered_search" id="filtered_search">
        <option value="name">Name</option>
        <option value="tag">Tag</option>
        <option value="difficulty">Difficulty</option>
      </select>

      <button style={submitbox}>SEARCH</button>
    </form>
  );
}
