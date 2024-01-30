import React, { FC, useEffect } from "react";
import { useMap } from "react-leaflet";

const MapController = ({selectedReview}) => {
  const map = useMap();
  const flyToDuration = 1.5;
  const DEFAULT_CENTER = [31.235929042252015, 121.48053886017651];

  const flyTo = (location) => {
    map.flyTo(location, 15, {
      animate: true,
      duration: flyToDuration,
    });
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

  return null;
}

export { MapController };