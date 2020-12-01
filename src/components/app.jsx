import React, { useEffect, useState } from 'react';
import FieldSelector from './field-selector';

import fetch from '../lib/fetch.mjs';

const App = (props) => {
  const { API_URI, map } = props;

  const [isMapLoaded, setIsMapLoaded] = useState(null);
  const [isMapSourced, setIsMapSourced] = useState(false);
  const [schemaDefs, setSchemaDefs] = useState(null);
  const [dataRecs, setDataRecs] = useState(null);
  const [boundaryGeoJson, setBoundaryGeoJson] = useState(null);
  const [centroidGeoJson, setCentroidGeoJson] = useState(null);
  const [errorMessages, setErrorMessages] = useState([]);

  const [selectedFinanceField, setSelectedFinanceField] = useState('development-finance');
  const [selectedForestField, setSelectedForestField] = useState('tree-cover-loss-mega');

  const selectedListLength = 10;
  const selectedListSortOrderAscending = true;

  useEffect(() => {
    if (schemaDefs) return;
    fetch(API_URI, 'schema-defs.json')
      .then((response) => {
        setSchemaDefs(response.data);
      })
      .catch((err) => {
        setSchemaDefs([]);
        setErrorMessages([...errorMessages, err]);
      });
  }, [API_URI, schemaDefs, errorMessages]);

  useEffect(() => {
    if (dataRecs) return;
    fetch(API_URI, 'data-recs.json')
      .then((response) => {
        setDataRecs(response.data);
      })
      .catch((err) => {
        setDataRecs([]);
        setErrorMessages([...errorMessages, err]);
      });
  }, [API_URI, dataRecs, errorMessages]);

  useEffect(() => {
    if (centroidGeoJson) return;
    fetch(API_URI, 'data-centroids.geojson')
      .then((response) => {
        setCentroidGeoJson(response.data);
      })
      .catch((err) => {
        setCentroidGeoJson({});
        setErrorMessages([...errorMessages, err]);
      });
  }, [API_URI, centroidGeoJson, errorMessages]);

  useEffect(() => {
    if (boundaryGeoJson) return;
    fetch(API_URI, 'data-boundaries.geojson')
      .then((response) => {
        setBoundaryGeoJson(response.data);
      })
      .catch((err) => {
        setBoundaryGeoJson({});
        setErrorMessages([...errorMessages, err]);
      });
  }, [API_URI, boundaryGeoJson, errorMessages]);

  useEffect(() => {
    if (isMapLoaded !== null) return;
    map.on('load', () => {
      setIsMapLoaded(true);
    });
    setIsMapLoaded(false);
  }, [map, isMapLoaded]);

  useEffect(() => {
    if (isMapSourced) return;
    if (!(isMapLoaded && schemaDefs && dataRecs && centroidGeoJson && boundaryGeoJson)) return;
    map.addSource('boundaries', {
      type: 'geojson',
      promoteId: 'country-id',
      data: boundaryGeoJson,
    });
    map.addSource('centroids', {
      type: 'geojson',
      promoteId: 'country-id',
      data: centroidGeoJson,
    });
    setIsMapSourced(true);
  }, [isMapSourced, isMapLoaded, schemaDefs, dataRecs, centroidGeoJson, boundaryGeoJson, map]);

  const compare = (ixA, ixB) => {
    const recA = dataRecs[ixA];
    const recB = dataRecs[ixB];
    let difference = recB[selectedFinanceField] - recA[selectedFinanceField];
    if (difference) return selectedListSortOrderAscending ? -difference : difference;

    if (selectedForestField) difference = recB[selectedForestField] - recA[selectedForestField];
    return difference;
  };

  const handleFinanceSelection = (nextSelectedField) => {
    setSelectedFinanceField(nextSelectedField);
  };

  const handleForestSelection = (nextSelectedField) => {
    setSelectedForestField(nextSelectedField);
  };

  const redrawFinanceLayer = () => {
    if (map.getLayer('centroid-layer')) map.removeLayer('centroid-layer');
    if (!selectedFinanceField) return;
    const fieldDef = schemaDefs.find((def) => (def.fieldId === selectedFinanceField));
    if (!fieldDef) return;
    // build step (quartile) array per MapBox specification
    const steps = [];
    for (let ix = 0; ix < fieldDef.binPartitions.length; ix += 1) {
      steps.push(Number(fieldDef.binPartitions[ix].size));
      if (ix < (fieldDef.binPartitions.length - 1)) steps.push(fieldDef.binPartitions[ix].upperBoundary);
    }
    // build filter
    let filteredIds = dataRecs.map((rec, ix) => ix).sort((ixA, ixB) => compare(ixA, ixB));
    if (selectedListLength < filteredIds.length) filteredIds = filteredIds.slice(0, selectedListLength);
    filteredIds = filteredIds.map((ix) => dataRecs[ix]['country-id']);
    // add the layer
    map.addLayer({
      id: 'centroid-layer',
      type: 'circle',
      source: 'centroids',
      layout: {},
      paint: {
        'circle-opacity': 0.5,
        'circle-radius': [
          'step',
          ['get', selectedFinanceField],
          ...steps,
        ],
        'circle-color': '#fbb03b',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#333333',
      },
      filter: ['in', 'country-id', ...filteredIds],
    });
  };

  const redrawForestLayer = () => {
    if (map.getLayer('boundary-layer')) map.removeLayer('boundary-layer');
    if (!selectedForestField) return;
    const fieldDef = schemaDefs.find((def) => (def.fieldId === selectedForestField));
    if (!fieldDef) return;
    const steps = [];
    for (let ix = 0; ix < fieldDef.binPartitions.length; ix += 1) {
      steps.push(fieldDef.binPartitions[ix].color);
      if (ix < (fieldDef.binPartitions.length - 1)) steps.push(fieldDef.binPartitions[ix].upperBoundary);
    }
    map.addLayer({
      id: 'boundary-layer',
      type: 'fill',
      source: 'boundaries',
      layout: {},
      paint: {
        // 'fill-color': '#088',
        'fill-color': [
          'step',
          ['get', selectedForestField],
          ...steps,
        ],
        'fill-opacity': 0.8,
      },
    });
  };

  if (isMapSourced) {
    redrawForestLayer();
    redrawFinanceLayer();
  }

  return (
    <div>
      <FieldSelector onChange={handleForestSelection} fieldDefs={(schemaDefs || []).filter((def) => (def.dataGroup === 'forest'))} />
      <FieldSelector onChange={handleFinanceSelection} fieldDefs={(schemaDefs || []).filter((def) => (def.dataGroup === 'finance'))} />
    </div>
  );
};

export default App;
