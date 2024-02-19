import { useEffect, useRef, useState } from 'react';
import Leaflet from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import {MapController} from './MapController';


import styles from './Map.module.scss';

import {avataList} from '../../utils';

const { MapContainer, Marker, Popup } = ReactLeaflet;

const Map = ({ children, className, width, height, selectedReview, activeMember, ...rest }) => {

  let iconAvatar = [];
  
  for (let index = 0; index < avataList.length; index++) {
    const item = avataList[index];
    iconAvatar.push(Leaflet.icon({ iconUrl: item.url, iconSize: [52, 52], popupAnchor: [0, -52], iconAnchor: [26, 52],}))
  }
  // console.log('iconAvatar', iconAvatar);
  const [iconMap, setIconMap] = useState(iconAvatar);
  // const mapEl = useRef(null);
  let mapInstance = useRef(null);
  let mapClassName = styles.map;
  if ( className ) {
    mapClassName = `aaa`;
  }

  useEffect(() => {
    (async function init() {
      delete Leaflet.Icon.Default.prototype._getIconUrl;
      Leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    })();
  }, []);

  return (
    <>
      <MapContainer className={mapClassName} ref={e => { mapInstance = e }} {...rest}>
        {children(ReactLeaflet, Leaflet)}
        <MapController
          selectedReview={selectedReview} activeMember={activeMember}
        />
        {activeMember && activeMember.map((item, index) => {
          console.log('MapContainer Marker', item, index)
          return (
            <Marker position={[item.position_lat, item.position_long]} key={`${item.position_lat}${item.timer_time}${item.speed}${index}`} 
              icon={iconMap[item.avatarIndex]}
            >
              <Popup>
                天呐，累死了！<br /> 我被拉爆了！
              </Popup>
            </Marker>
          );
          
        })}
      </MapContainer>

    </>
    
  )
}

export default Map;