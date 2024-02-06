import { useEffect, useState } from "react";

export const toHHMMSS = (secs) => {
  var sec_num = parseInt(secs, 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor(sec_num / 60) % 60;
  var seconds = sec_num % 60;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? "0" + v : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
};

// Hook
export function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

export function merageWindSpeedAndTemperature (windData) {
  console.log('merageWindSpeedAndTemperature', windData);
  // 合并数组中相同时间戳的值并转换为对象
  let mergedObject = {};

  // 第一次循环处理第一个数组
  for (let item of windData.channels[0].values) {
    if (!mergedObject[item.timeStamp]) {
      mergedObject[item.timeStamp] = { windTemperature: item.value, windSpeed: null };
    } else {
      mergedObject[item.timeStamp].windTemperature = item.value;
    }
  }

  // 第二次循环处理第二个数组
  for (let item of windData.channels[1].values) {
    if (mergedObject[item.timeStamp]){
      mergedObject[item.timeStamp].windSpeed = item.value;
    }
  }
  return mergedObject;
}

// 更新CdA值的函数，接受温度、海拔、海平面压力、滚动阻力系数、传动效率、速度、骑士和车的总重量和功率作为参数
export function updateCdA({temperature, altitude, crr, dte, windSpeed, weight, power}) {
  // if (power < 20){
  //   return 0;
  // }
  // if (temperature === -2.9) {
  //   console.log('updateCdA1', temperature, altitude, crr, dte, windSpeed, weight, power);
  // }
  
  // 计算cda值
  const pressureAtSealevel = 101325;
  var cda = temperature;
  let tempSpeed = temperature + 273.15; // 将速度转换为开尔文温度
  // 调用计算m_total的函数
  var m_total = calculateMTotal(pressureAtSealevel, tempSpeed, altitude); // 计算m_total
  let density = 0.0289644 * m_total / (8.31432 * tempSpeed); // 计算功率
  
  cda = density; // 更新cda值
  let CRR = crr / 100000; // 更新滚动阻力系数
  let drivetrain_efficiency = dte / 1000; // 更新传动效率
  let speed = windSpeed / 3.6; // 将速度转换为英里每小时
  // m_total = weight; // 更新重量
  // power = power; // 更新功率
  // 根据给定公式计算CdA值
  cda = ((power * drivetrain_efficiency) - speed * CRR * weight * 9.80665) / (speed * speed * speed * 0.5 * cda);
  if (temperature === -2.9) {
    console.log('updateCdA pressure', m_total); // 打印压力
    console.log('updateCdA density', density); // 打印密度
    console.log('updateCdA2', temperature, altitude, crr, dte, windSpeed, speed, weight, power, cda);
  }
  if (cda>15 || cda<0) {
    return 0;
  }
  
  return cda.toFixed(5); // 返回保留5位小数的CdA值
  
}

// 计算m_total的函数，接受海平面压力、速度和海拔作为参数
function calculateMTotal(pressureAtSealevel, speed, altitude) {
  var M = 0.0289644; // 空气摩尔质量
  var g = 9.80665; // 重力加速度
  var R = 8.31432; // 气体常数
  var e, i;
  if (altitude < 11000) {
      e = -0.0065; // 温度随海拔高度变化率
      i = 0; // 初始海拔高度
      // 根据给定公式计算m_total值
      return pressureAtSealevel * Math.pow(speed / (speed + e * (altitude - i)), g * M / (R * e));
  }
  if (altitude <= 20000) {
      e = -0.0065; // 温度随海拔高度变化率
      i = 0; // 初始海拔高度
      // 根据给定公式计算m_total值
      return pressureAtSealevel * Math.pow(speed / (speed + e * (11000 - i)), g * M / (R * e)) * Math.exp(-g * M * (altitude - 11000) / (R * speed + -71.5));
  }
  return NaN; // 若海拔高度超出范围，返回NaN
}
/**
 * Get a center latitude,longitude from an array of like geopoints
 *
 * @param array data 2 dimensional array of latitudes and longitudes
 * For Example:
 * $data = array
 * (
 *   0 = > array(45.849382, 76.322333),
 *   1 = > array(45.843543, 75.324143),
 *   2 = > array(45.765744, 76.543223),
 *   3 = > array(45.784234, 74.542335)
 * );
*/
export function GetCenterFromDegrees(data){       
    if (!(data.length > 0)){
        return false;
    } 

    var num_coords = data.length;

    var X = 0.0;
    var Y = 0.0;
    var Z = 0.0;

    console.log('GetCenterFromDegrees', data, data.length);

    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      var lat = item[0] * Math.PI / 180;
      var lon = item[1] * Math.PI / 180;

      var a = Math.cos(lat) * Math.cos(lon);
      var b = Math.cos(lat) * Math.sin(lon);
      var c = Math.sin(lat);

      X += a;
      Y += b;
      Z += c;
      
    }

    // for(i = 0; i < data.length; i++){
    //     var lat = data[i][0] * Math.PI / 180;
    //     var lon = data[i][1] * Math.PI / 180;

    //     var a = Math.cos(lat) * Math.cos(lon);
    //     var b = Math.cos(lat) * Math.sin(lon);
    //     var c = Math.sin(lat);

    //     X += a;
    //     Y += b;
    //     Z += c;
    // }

    X /= num_coords;
    Y /= num_coords;
    Z /= num_coords;

    var lon = Math.atan2(Y, X);
    var hyp = Math.sqrt(X * X + Y * Y);
    var lat = Math.atan2(Z, hyp);

    var newX = (lat * 180 / Math.PI);
    var newY = (lon * 180 / Math.PI);

    return new Array(newX, newY);
}