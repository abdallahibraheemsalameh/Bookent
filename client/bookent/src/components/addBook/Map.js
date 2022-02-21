import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

import React from 'react';
import './Map.css';

function Mapp(props) {
  function clickHandler() {
    props.onClose();
  }
  return (
    <>
      <div className='clickDrop'>
        <div className='mapContainer'>
          <Map
            google={props.google}
            zoom={13}
            style={{ height: `100%` }}
            initialCenter={{ lat: props.GeoLA, lng: props.GeoLO }}
          >
            <Marker position={{ lat: props.GeoLA, lng: props.GeoLO }} />
          </Map>
        </div>
        <button onClick={clickHandler} className='mapBTN'>
          Okay
        </button>
      </div>
    </>
  );
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDNIwHJaHSZcYGx1vZaYisMNF9-rfRNNWQ',
})(Mapp);
