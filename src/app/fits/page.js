'use client'

import Head from "next/head";

import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic'

import NewActivity from '../../components/newActivity';
import AvatarCard from '../../components/avatarCard';
import Map from '../../components/map';
import TimeLine from '../../components/timeLine';

import { LTTB } from "downsample";
import {GetCenterFromDegrees, useWindowSize} from '../../utils';

// File dropper file extension config
const fileTypes = ["FIT"];
const DEFAULT_CENTER = [31.235929042252015, 121.48053886017651]

export default function Fits() {
  const [isShowAdd, setIsShowAdd] = React.useState(false);
  const [members, setMembers] = React.useState([]);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [resolution, setResolution] = useState(1000);
  const purpleOptions = { color: 'purple' }
  const [selectedReview, setSelectedReview] = useState({location:DEFAULT_CENTER});
  const [memberSimplified, setMemberSimplified] = useState();
  const [activeTime, setActiveTime] = useState();
  const [memberFitList, setMemberFitList] = useState([]);
  const [activeTimeMemberFitItemList, setActiveTimeMemberFitItemList] = useState([]);
  const [mapViewType, setMapViewType] = useState('400');


  const handleOpenAddNewPop = () => {
    setIsShowAdd(true);
    // console.log('handleOpenAddNewPop');
  };
  const handleCloseAddNewPop = () => {
    setIsShowAdd(false);
  };

  const size = useWindowSize();

  React.useEffect(() => {
    if (size.width >= 800) {
      setMapViewType('400');
    } else {
      setMapViewType('1200');
    }
    // if(size.width > )
  }, [size]);

  const handleAddNewActivity = (e) => {
    // console.log('handleAddNewActivity', e, members);
    let oldMember = members
    oldMember.push(e);
    setMembers(oldMember);

    // 第一次上传渲染地图
    if (members.length < 2) {
      let records = members[0].fit.records;
      if (records) {
        // this is a workaround until I figure out how to use the advanced API from https://github.com/janjakubnanista/downsample#advanced-api
        console.log('LeafMap,gpsData', records);
        let dataPrepForLTTB = records.map((record) => {
          // In addition to the x and y keys (so LTTB func doesn't fail,
          // also let it smooth out additional data points for this FIT file.
          return { x: record.elapsed_time, y: 0, ...record };
        });

        let simplified = LTTB(dataPrepForLTTB, resolution);
        setMemberSimplified(simplified);
        let points = []
        for (let index = 0; index < simplified.length; index++) {
          const element = simplified[index];
          if (element.position_lat) {
            points.push([element.position_lat, element.position_long]);
          }
        }
        let newMapCenter = GetCenterFromDegrees(points)
        setPolygonPoints(points);
        setMapCenter(newMapCenter);
        setSelectedReview({location:newMapCenter})
        // console.log('polygonPoints', points, GetCenterFromDegrees(points));
      }
    }
    
    // 每一次上传都添加一个按时间对照的快速对象
    let oldMemberFitList = memberFitList;
    let tempFitList = {};
    let fitRecords = e.fit.records;
    for (let index = 0; index < fitRecords.length; index++) {
      const element = fitRecords[index];
      if (element.position_lat) {
        const date1 = new Date(element.timestamp).getTime() / 1000;
        tempFitList[date1] = element;
      }
    }
    oldMemberFitList.push(tempFitList);
    setMemberFitList(oldMemberFitList);
  }
  const handleTimeSelect = (item) => {
    console.log('handleTimeSelect', item.payload.timestamp);
    setActiveTime(item.payload.timestamp);
  };

  useEffect(() => {
    if (activeTime ) {
      const date1 = new Date(activeTime).getTime() / 1000;
      let fitItemList = [];
      for (let index = 0; index < memberFitList.length; index++) {
        const element = memberFitList[index];
        console.log('Fits', index, element[date1], date1);
        if(element[date1] && element[date1].position_lat){
          element[date1].avatarIndex = members[index].avatarIndex;
          fitItemList.push(element[date1])
        }
      }
      console.log('fitItemList', fitItemList);
      setActiveTimeMemberFitItemList(fitItemList);
    }
  }, [activeTime]);


  return (
    <section>
     
      {isShowAdd ? (
        <><NewActivity handleCloseAddNewPop={handleCloseAddNewPop} handleAddNewActivity={handleAddNewActivity} /></>
      ) : null}
      
      <div className="mx-auto px-0 py-0 sm:px-6">
        <div className="grid grid-cols-1 gap-1 lg:grid-cols-4 lg:items-stretch">
        {members && members.length >0 && !isShowAdd ? (
          <div className="col-span-4">
           
            <Map width="800" height={mapViewType} center={mapCenter} zoom={14} selectedReview={selectedReview} activeMember={activeTimeMemberFitItemList}>
              {({ TileLayer, Marker, Popup, Polyline }) => (
                <>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                  />
                  
                  <Polyline pathOptions={purpleOptions} positions={polygonPoints} />
                </>
              )}
            </Map>
            <><TimeLine data={memberSimplified} callback={handleTimeSelect}></TimeLine></>
              
        </div>) : null}
          
          <div className="w-full col-span-4 flex">
            
            <div className="max-w-sm text-center lg:text-left bg-white rounded dark:bg-gray-600 m-4">
    
              <a
                href="#"
                className="m-4 inline-block rounded border border-gray-900 bg-gray-900 px-12 py-3 text-sm font-medium text-white transition hover:shadow focus:outline-none focus:ring"
                onClick={handleOpenAddNewPop}
              >
                + Add Member
              </a>
            </div>
          </div>
          <div className="w-full absolute t-10 r-10 flex z-[9999] justify-end pr-8 pt-2 pointer-events-none">
            {members.map((member, index) =>(
              <AvatarCard key={index} index={index} info={member} activeMember={activeTimeMemberFitItemList[index]}/>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}