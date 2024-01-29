
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Popup, Marker, useMapEvents } from 'react-leaflet';
import Draggable from 'react-draggable';

const LeafMap = ({isShowingMap, gpsData, activePoint}) => {
  const nodeRef = useRef(null);
  
  const [lat, setLat] = useState(31.2231);
  const [log, setLog] = useState(121.69424);

  useEffect(() => {
    if (activePoint && activePoint?.payload) {
      console.log('LeafMap', activePoint?.payload);
      setLat(activePoint?.payload?.position_lat);
      setLog(activePoint?.payload?.position_long);
    }
  }, [activePoint]);

  return (
    <>
      {isShowingMap && (
        <Draggable nodeRef={nodeRef}>
          <div ref={nodeRef} className="absolute top-1/4 left-1/4 text-black bg-white p-0 max-w-scƒreen-md bg-neutral-50 text-center antialiased shadow-2xl shadow-zinc-900 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%]  overflow-hidden z-50">
            <div className="handle">Map</div>
            <div className="overflow-hidden">
              <MapContainer center={[lat, log]} zoom={16} scrollWheelZoom={true}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </MapContainer>
            </div>
          </div>
        </Draggable>
      )}
    </>
  );
};

export default LeafMap;