import { useEffect, useRef } from 'react';
import Leaflet from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import {MapController} from './MapController';

import styles from './Map.module.scss';

const { MapContainer } = ReactLeaflet;

const Map = ({ children, className, width, height, selectedReview, ...rest }) => {

  // const mapEl = useRef(null);
  let mapInstance = useRef(null);
  let mapClassName = styles.map;
  if ( className ) {
    mapClassName = `aaa`;
  }

  // useEffect(() => {
  //   (async function init() {
  //     delete Leaflet.Icon.Default.prototype._getIconUrl;
  //     Leaflet.Icon.Default.mergeOptions({
  //       iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  //       iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  //       shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  //     });
  //   })();
  // }, []);

  return (
    <>
      <MapContainer className={mapClassName} ref={e => { mapInstance = e }} {...rest}>
        {children(ReactLeaflet, Leaflet)}
        <MapController
          selectedReview={selectedReview}
        />
      </MapContainer>

    </>
    
  )
}

export default Map;