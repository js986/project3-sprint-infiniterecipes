import * as React from 'react';
import { Socket } from './Socket';

function zipSubmit(event) {
    const newZip = document.getElementById('zip_code');
    Socket.emit('new zipcode query', {
        zip: newZip.value,
    });
    console.log("This is newZip.value " + newZip.value);
    newZip.value = '';

    event.preventDefault();
}



export function GoogleMaps() {
    return (
        <form onSubmit={zipSubmit}>
                <input id="zip_code" placeholder="Enter your zipcode (#####)" />
                <button > Find local stores </button>
        </form>
        );
}