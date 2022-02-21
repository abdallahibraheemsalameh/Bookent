import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

import React from 'react';
import './Map2.css';

function Mapp(props) {

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
      
      </div>
    </>
  );
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDNIwHJaHSZcYGx1vZaYisMNF9-rfRNNWQ',
})(Mapp);
