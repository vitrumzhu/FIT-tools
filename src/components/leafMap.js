
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Popup, Marker } from 'react-leaflet';
import Draggable from 'react-draggable';

const LeafMap = ({isShowingMap}) => {
  const nodeRef = useRef(null);

  return (
    <>
      {isShowingMap && (
        <Draggable nodeRef={nodeRef}>
          <div ref={nodeRef} className="absolute top-1/4 left-1/4 text-black bg-white p-0 max-w-screen-md bg-neutral-50 text-center antialiased md:p-0 shadow-2xl shadow-zinc-900 absolute bottom-0 left-0 -translate-x-1/2 -translate-y-1/2 h-[50%]  overflow-hidden z-50">
            <div className="handle">Map</div>
            <div className="overflow-hidden">
              <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[51.505, -0.09]}>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </Draggable>
      )}
    </>
  );
};

export default LeafMap;