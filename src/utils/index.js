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

// 更新CdA值的函数，接受温度、海拔、海平面压力、滚动阻力系数、传动效率、速度、骑士和车的总重量和功率作为参数
export function updateCdA({temperature, altitude, pressureAtSealevel, crr, dte, speed, weight, power}) {
  // 计算cda值
  var cda = temperature / 36;
  speed = speed + 273.15; // 将速度转换为开尔文温度
  // 调用计算m_total的函数
  var m_total = calculateMTotal(pressureAtSealevel, speed, altitude); // 计算m_total
  power = 0.0289644 * m_total / (8.31432 * speed); // 计算功率
  console.log('pressure', m_total); // 打印压力
  console.log('density', power); // 打印密度
  cda = power; // 更新cda值
  let CRR = crr / 100000; // 更新滚动阻力系数
  let drivetrain_efficiency = dte / 1000; // 更新传动效率
  speed = speed / 36; // 将速度转换为英里每小时
  m_total = weight; // 更新重量
  power = power; // 更新功率
  // 根据给定公式计算CdA值
  cda = ((power * drivetrain_efficiency) - speed * CRR * m_total * 9.80665) / (speed * speed * speed * 0.5 * cda);
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