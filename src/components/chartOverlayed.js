import React from "react";
import { motion } from "framer-motion";
import {
  Line,
  Brush,
  Area,
  XAxis,
  AreaChart,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Legend,
} from "recharts";

import { Tokens } from "../styles/tokens";
import * as _ from "lodash";
import { LTTB } from "downsample";
import { toHHMMSS } from "../utils";
import ButtonSwitcher from "./ButtonSwitcher";

const CustomTooltip = ({ active, payload, label, callback }) => {
  const [clickDisabled, setClickDisabled] = React.useState(false);
  const [selectItem, setSelectItem] = React.useState({})
  const handleClick = (item) => {
    if (!clickDisabled) {
      // 在点击时执行您的函数
      if (callback && item?.payload?.timestamp !== selectItem.payload?.timestamp ) {
        callback(item);
        // console.log('handleClick', item);
      }
      // 设置clickDisabled为true，防止一秒内再次触发
      setClickDisabled(true);

      // 一秒后重置clickDisabled为false，允许再次触发
      setTimeout(() => {
        setClickDisabled(false);
        setSelectItem(item);
      }, 300);
    }
  };
  let listItems = payload.map((item) => {
    if (item.name === 'Power') {
      handleClick(item);
    }
    if (item.name == "Altitude") {
      return (
        <li
          key={item.name}
          style={{ listStyle: "none", display: "flex", alignItems: "center" }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              marginRight: 8,
              display: "block",
              backgroundColor: item.color,
            }}
          />
          {item.name}:{" "}
          <strong>
            {Math.round(item.value * 1000)} {item.unit || ""}
          </strong>
        </li>
      );
    } else if (item.name === "cda") {
      return (
        <li
          key={item.name}
          style={{ listStyle: "none", display: "flex", alignItems: "center" }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              marginRight: 8,
              display: "block",
              backgroundColor: item.color,
            }}
          />
          {item.name}:{" "}
          <strong>
            {item.value} {item.unit || ""}
          </strong>
        </li>
      );
    } else {
      return (
        <li
          key={item.name}
          style={{ listStyle: "none", display: "flex", alignItems: "center" }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              marginRight: 8,
              display: "block",
              backgroundColor: item.color,
            }}
          />
          {item.name}:{" "}
          <strong>
            {Math.round((item.value * 100) / 100)} {item.unit || ""}
          </strong>
        </li>
      );
    }
  });
  if (active && payload && payload.length) {
    let timerTime = payload[0].payload.elapsed_time;
    return (
      <div className="p-4 bg-gray-700 rounded-md shadow-md border border-gray-600">
        <span className="text-gray-200 text-xs mb-2 block">
          {toHHMMSS(timerTime)}
        </span>
        <hr className="mb-1 border-gray-500"></hr>
        {listItems}
      </div>
    );
  }

  return null;
};

export default function ChartOverlayed({ data, callback }) {
  const [resolution, setResolution] = React.useState(1000);
  const [fouceMode, setFouceMode] = React.useState(true);

  let records = data.records;

  // Generate list of unique keys for this fit file
  let uniqueKeys = Object.keys(
    records.reduce(function (result, obj) {
      return Object.assign(result, obj);
    }, {})
  );

  console.log(uniqueKeys);

  const handleTipsUpdate = (item) => {
    // console.log('handleTipsUpdate', item);
    if (callback) {
      callback(item);
    }
  };

  // this is a workaround until I figure out how to use the advanced API from https://github.com/janjakubnanista/downsample#advanced-api
  let dataPrepForLTTB = records.map((record) => {
    // In addition to the x and y keys (so LTTB func doesn't fail,
    // also let it smooth out additional data points for this FIT file.
    return { x: record.elapsed_time, y: 0, ...record };
  });

  let simplified = LTTB(dataPrepForLTTB, resolution);

  console.log("simplified", simplified);

  const container = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
  };

  const handleSwitchChange = (key) => {
    console.log('handleSwitchChange', key);
    setFouceMode(!key);
  };

  return (
    <>
      <motion.div
        variants={container}
        animate="show"
        initial="hidden"
        style={{ width: "100%", height: "600px" }}
        className="p-6 rounded-md mb-4 border border-gray-700 bg-gray-800"
      >
        <ResponsiveContainer debounce={0.2} height={"100%"}>
          <ComposedChart data={simplified} margin={{ top: 0 }}>
            <XAxis
              dataKey="elapsed_time"
              allowDataOverflow={true}
              interval={"preserveEnd"}
              orientation={"bottom"}
              padding={{ left: 40 }}
              stroke={"#CCC"}
              minTickGap={200}
              tickCount={4}
              tick={{ fontSize: 14 }}
              tickFormatter={(val) => {
                return toHHMMSS(val);
              }}
            />
            <Legend verticalAlign="top" height={80} align="left" />
            <YAxis
              dataKey={"power"}
              domain={[0, "auto"]}
              tickCount={5}
              axisLine={false}
              stroke={"#CCC"}
              tickSize={0}
              unit=" W"
              mirror={true}
              verticalAnchor="end"
              tick={{ fontSize: 14, dy: -10, dx: -2 }}
            />
            <YAxis
              yAxisId="windSpeed"
              dataKey={"windSpeed"}
              tick={{ fontSize: 14 }}
              domain={[0, 60]}
              tickCount={5}
              axisLine={false}
              tickSize={0}
              hide={true}
              tickFormatter={(value) => Math.round(value * 1000)}
              unit=" m"
            />
            <YAxis
              yAxisId="cda"
              dataKey={"cda"}
              tick={{ fontSize: 14 }}
              domain={[-20, 8]}
              tickCount={5}
              axisLine={false}
              tickSize={0}
              hide={true}
              unit=" m²"
            />
            <YAxis
              yAxisId="altitude"
              dataKey={"altitude"}
              domain={[0, 1]}
              tickCount={5}
              axisLine={false}
              tickSize={0}
              hide={true}
              tickFormatter={(value) => Math.round(value * 1000)}
              unit=" m"
              tick={{ fontSize: 14, dy: -10, dx: -2 }}
            />
            <YAxis
              yAxisId="speed"
              dataKey={"speed"}
              tick={{ fontSize: 14 }}
              domain={[0, 80]}
              tickCount={5}
              axisLine={false}
              tickSize={0}
              hide={true}
              tickFormatter={(value) => Math.round(value * 1000)}
              unit=" m"
            />
            <YAxis
              yAxisId="cadence"
              dataKey={"cadence"}
              tick={{ fontSize: 14 }}
              domain={[0, 160]}
              tickCount={5}
              axisLine={false}
              tickSize={0}
              hide={true}
              tickFormatter={(value) => Math.round(value * 1000)}
              unit=" m"
            />
            <YAxis
              yAxisId="heart_rate"
              dataKey={"heart_rate"}
              tick={{ fontSize: 14 }}
              domain={[0, 220]}
              tickCount={5}
              axisLine={false}
              tickSize={0}
              hide={true}
              unit="bpm"
            />

            

            <Tooltip
              cursor={{ stroke: "white" }}
              content={<CustomTooltip  callback={handleTipsUpdate}/>}
              isAnimationActive={false}
              payload={[{ name: "power", unit: "W" }]}
            />
            <CartesianGrid
              vertical={false}
              strokeDasharray="4"
              strokeOpacity={0.3}
            />
            <Line
              isAnimationActive={false}
              name="Power"
              type="monotone"
              dataKey="power"
              stroke={Tokens.power}
              unit={"W"}
              dot={false}
              activeDot={{ r: 4 }}
              onMouseDown={(e) => console.log({ e })}
            />
            <Line
              isAnimationActive={false}
              name="windSpeed"
              yAxisId="windSpeed"
              type="monotone"
              dataKey="windSpeed"
              stroke={Tokens.windSpeed}
              dot={false}
              unit={"kph"}
              activeDot={{ r: 4 }}
            />
            <Line
              isAnimationActive={false}
              name="cda"
              yAxisId="cda"
              type="monotone"
              dataKey="cda"
              stroke={Tokens.cda}
              dot={false}
              unit={"M²"}
            />
            {!fouceMode ? (<>
              <Line
                isAnimationActive={false}
                name="Speed"
                yAxisId="speed"
                type="monotone"
                dataKey="speed"
                stroke={Tokens.speed}
                dot={false}
                unit={"kph"}
                activeDot={{ r: 4 }}
              />
              <Line
                isAnimationActive={false}
                type="monotone"
                name="Heart rate"
                dataKey="heart_rate"
                yAxisId="heart_rate"
                stroke={Tokens.heartrate}
                dot={false}
                unit={"bpm"}
                activeDot={{ r: 4 }}
              />
              <Line
                isAnimationActive={false}
                type="monotone"
                dataKey="cadence"
                name="Cadence"
                yAxisId="cadence"
                stroke={Tokens.cadence}
                dot={false}
                unit={"bpm"}
                activeDot={{ r: 4 }}
              />
            </>) : null}
            <Area
              type="linear"
              yAxisId="altitude"
              name="Altitude"
              isAnimationActive={false}
              dataKey="altitude"
              stroke={"#ccc"}
              fill={"#ccc"}
              dot={false}
              unit={"m"}
              activeDot={{ r: 4 }}
              tickFormatter={(val) => val * 1000}
            />
            <Brush
              alwaysShowText={false}
              fill={"rgba(0, 0, 0, 1)"}
              stroke={"#ccc"}
              travellerWidth={24}
              height={48}
              clip={true}
              tickFormatter={(val) => toHHMMSS(simplified[val].elapsed_time)}
            >
              <AreaChart data={data.records}>
                <Area
                  type="linear"
                  yAxisId="altitude"
                  isAnimationActive={false}
                  dataKey="altitude"
                  stroke={"none"}
                  fill={"rgba(255, 255, 255, .6)"}
                  dot={false}
                  unit={"m"}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </Brush>
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>
      <ButtonSwitcher laberText={'Fouce Mode'} onChange={handleSwitchChange} />
    </>
  );
}
