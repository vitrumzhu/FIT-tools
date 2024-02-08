import React, { useState } from 'react';
import { motion } from "framer-motion";
import ChartCard from './chartCard';
import { Tokens } from "../styles/tokens";
import * as _ from "lodash";
import { LTTB } from "downsample";
import { toHHMMSS, useWindowSize } from "../utils";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};


const TimeLine = ({data, callback}) => {
  const [brush, setBrush] = React.useState({ startIndex: 0, endIndex: 1000 });

  return (
    <div className="bg-white dark:bg-gray-600">
      <motion.div variants={container} initial="hidden" animate="show">
        <ChartCard
          data={data}
          datakey={"altitude"}
          name={"Altitude"}
          unit={"m"}
          color={Tokens.altitude}
          brushStartIndex={brush.startIndex}
          brushEndIndex={brush.endIndex}
          callback={callback}
        />
      </motion.div>
    </div>
  )
}


export default TimeLine;