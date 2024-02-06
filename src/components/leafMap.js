
import React, { useState, useEffect, useRef } from 'react';

import Draggable from 'react-draggable';

import Map from './map';
import { LTTB } from "downsample";
import {GetCenterFromDegrees} from '../utils';

const DEFAULT_CENTER = [31.235929042252015, 121.48053886017651]


const LeafMap = ({isShowingMap, gpsData, activePoint}) => {
  const nodeRef = useRef(null);
  
  const [newPointCenter, setNewPointCenter] = useState(DEFAULT_CENTER);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [selectedReview, setSelectedReview] = useState({location:DEFAULT_CENTER});
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [resolution, setResolution] = useState(1000);
  const purpleOptions = { color: 'purple' }

  


  useEffect(() => {
    if (activePoint && activePoint?.payload) {
      console.log('LeafMap', activePoint?.payload);
      setNewPointCenter([activePoint?.payload.position_lat, activePoint?.payload.position_long]);
    }
  }, [activePoint]);

  useEffect(() => {
    if  (gpsData?.data?.records) {
      // this is a workaround until I figure out how to use the advanced API from https://github.com/janjakubnanista/downsample#advanced-api
      console.log('LeafMap,gpsData', gpsData?.data?.records);
      let records = gpsData?.data?.records;
      let dataPrepForLTTB = records.map((record) => {
        // In addition to the x and y keys (so LTTB func doesn't fail,
        // also let it smooth out additional data points for this FIT file.
        return { x: record.elapsed_time, y: 0, ...record };
      });

      let simplified = LTTB(dataPrepForLTTB, resolution);
      let points = []
      for (let index = 0; index < simplified.length; index++) {
        const element = simplified[index];
        if (element.position_lat) {
          points.push([element.position_lat, element.position_long]);
        }
      }
      setPolygonPoints(points);
      // console.log('polygonPoints', points, GetCenterFromDegrees(points));
      let newMapCenter = GetCenterFromDegrees(points)
      setMapCenter(newMapCenter);
      setNewPointCenter(points[0]);
      setSelectedReview({location:newMapCenter})
    }
  }, []);

  

  return (
    <>
      {isShowingMap && (
        <Draggable nodeRef={nodeRef}>
          <div ref={nodeRef} className="absolute top-1/4 left-1/4 text-black bg-white p-0 max-w-scƒreen-md bg-neutral-50 text-center antialiased shadow-2xl shadow-zinc-900 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%]  overflow-hidden z-50">
            <div className="handle">Map</div>
            <div className="overflow-hidden">
              <Map width="800" height="400" center={mapCenter} zoom={14} selectedReview={selectedReview}>
                {({ TileLayer, Marker, Popup, Polyline }) => (
                  <>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    <Marker position={newPointCenter}>
                      <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                      </Popup>
                    </Marker>
                    <Polyline pathOptions={purpleOptions} positions={polygonPoints} />
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