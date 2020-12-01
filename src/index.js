/* global CONFIG */
import React from 'react';
import * as ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';

import App from './components/app';

import './styles/index.scss';

// "global" constants
const { API_URI, MAPBOX_ACCESS_TOKEN } = CONFIG;

// set up map
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  zoom: 0.5,
  minZoom: 0.5,
  scrollZoom: false,
  center: [15, -8],
  // renderWorldCopies: false,
  width: '776px',
  height: '400px',
});

ReactDOM.render(React.createElement(App, { API_URI, map }), document.getElementById('table'));
