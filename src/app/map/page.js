'use client'

import Head from "next/head";
import React, { useState } from "react";

import Map from '../../components/map';

const DEFAULT_CENTER = [31.235929042252015, 121.48053886017651]

export default function MapPage() {
  const [selectedReview, setSelectedReview] = useState({location:DEFAULT_CENTER})


  const onClickLondon = () => {
    setSelectedReview({location:[51.505, -0.09]})
  }

  return (
    <div className="bg-white">
      <button className='text-black' onClick={onClickLondon}>Fly back to London</button>
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
  );
}