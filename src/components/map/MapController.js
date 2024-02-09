import React, { FC, useEffect } from "react";
import { useMap } from "react-leaflet";
import {GetCenterFromDegrees} from '../../utils';

const MapController = ({selectedReview, activeMember}) => {
  const map = useMap();
  const flyToDuration = 0.5;
  const DEFAULT_CENTER = [31.235929042252015, 121.48053886017651];

  const flyTo = (location) => {
    if (location && location.length > 0) {
      let level = map.getZoom()
      map.flyTo(location, level, {
        animate: true,
        duration: flyToDuration,
      });
    }
  };

  const flyToCenter = () => {
    map.flyTo(DEFAULT_CENTER, 13, {
      animate: true,
      duration: flyToDuration,
    });
  };

  useEffect(() => {
    if(selectedReview) {
      flyTo(selectedReview.location);
    } else {
      flyToCenter();
    }
  }, [selectedReview])

  useEffect(() => {
    if (activeMember) {
      if (activeMember.length < 2 && activeMember[0]?.position_lat) {
        flyTo([activeMember[0].position_lat ,activeMember[0].position_long]);
      } else {
        let points = [];
        for (let index = 0; index < activeMember.length; index++) {
          const element = activeMember[index];
          points.push([element.position_lat, element.position_long])
        }
        let newMapCenter = GetCenterFromDegrees(points);
        flyTo(newMapCenter);
      }
      
    };
  }, [activeMember]);

  return null;
}

export { MapController };