import React from "react";
import { motion } from "framer-motion";
import {
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";

import * as _ from "lodash";
import { LTTB } from "downsample";
import { toHHMMSS, useWindowSize } from "../utils";


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
    handleClick(item);
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



const ChartCard = ({
  data,
  datakey,
  name,
  unit,
  color,
  brushStartIndex,
  brushEndIndex,
  callback
}) => {
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
  const handleTipsUpdate = (item) => {
    // console.log('handleTipsUpdate', item);
    if (callback) {
      callback(item);
    }
  };
  return (
    <motion.div
      variants={item}
      style={{ width: "100%", height: "120px" }}
      className="mb-4 border border-gray-700 bg-gray-800"
    >
      <ResponsiveContainer debounce={0.2} height={"100%"}>
        <ComposedChart
          syncId={"stacked"}
          data={data}
          margin={{ top: 24, bottom: 24 }}
        >
          <YAxis
            dataKey={datakey}
            domain={[0, "auto"]}
            width={80}
            stroke={"#ccc"}
            tickCount={4}
            axisLine={false}
            tickSize={0}
            mirror={true}
            tick={{ fontSize: 14, dy: -12, dx: -2 }}
            tickFormatter={(val, i) => {
              if (val > 0 && i == 3) {
                return `${val} ${unit}`;
              } else if (val > 0) {
                return `${val}`;
              }

              return "";
            }}
          />

          <Tooltip
            cursor={{ stroke: "white" }}
            content={<CustomTooltip  callback={handleTipsUpdate}/>}
            isAnimationActive={false}
          />
          <CartesianGrid
            vertical={false}
            strokeDasharray="4"
            strokeOpacity={0.3}
          />

          <defs>
            <linearGradient
              id={`${color}_gradient`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="20%" stopColor={color} stopOpacity={1} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            isAnimationActive={false}
            name={name}
            type="monotone"
            dataKey={datakey}
            stroke={color}
            fill={`url(#${color}_gradient)`}
            unit={unit}
            strokeWidth={1}
            dot={false}
            activeDot={{ r: 4 }}
          />

          <XAxis
            // type={"number"}
            dataKey="elapsed_time"
            interval={"preserveStartEnd"}
            // orientation={"bottom"}
            padding={{ left: 40 }}
            minTickGap={200}
            tickCount={3}
            // axisLine={false}
            domain={[1000, "auto"]}
            tick={{
              fontSize: 14,
              fill: "#CCC",
              color: "#FFF",
            }}
            tickFormatter={(val) => {
              return toHHMMSS(val);
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
};



export default ChartCard;