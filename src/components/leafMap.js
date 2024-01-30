
import React, { useState, useEffect, useRef } from 'react';

import Draggable from 'react-draggable';

import Map from './map';

const DEFAULT_CENTER = [31.235929042252015, 121.48053886017651]


const LeafMap = ({isShowingMap, gpsData, activePoint}) => {
  const nodeRef = useRef(null);
  
  // const [newCenter, setNewCenter] = useState(DEFAULT_CENTER)
  const [selectedReview, setSelectedReview] = useState({location:DEFAULT_CENTER})

  useEffect(() => {
    if (activePoint && activePoint?.payload) {
      console.log('LeafMap', activePoint?.payload);
      // setNewCenter([activePoint?.payload.position_lat, activePoint?.payload.position_long]);
      setSelectedReview({location:[activePoint?.payload.position_lat, activePoint?.payload.position_long]});
    }
  }, [activePoint]);

  return (
    <>
      {isShowingMap && (
        <Draggable nodeRef={nodeRef}>
          <div ref={nodeRef} className="absolute top-1/4 left-1/4 text-black bg-white p-0 max-w-scƒreen-md bg-neutral-50 text-center antialiased shadow-2xl shadow-zinc-900 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%]  overflow-hidden z-50">
            <div className="handle">Map</div>
            <div className="overflow-hidden">
              <Map width="800" height="400" center={DEFAULT_CENTER} zoom={14} selectedReview={selectedReview}>
                {({ TileLayer, Marker, Popup }) => (
                  <>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    <Marker position={DEFAULT_CENTER}>
                      <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                      </Popup>
                    </Marker>
                  </>
                )}
              </Map>
            </div>
          </div>
        </Draggable>
      )}
    </>
  );
};

export default LeafMap;