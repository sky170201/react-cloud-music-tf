
export const getCount = (count) => {
  if (count < 0) return;
  if (count < 10000) {
    return count;
  } else if (Math.floor(count / 10000) < 10000) {
    return Math.floor(count / 10000) + "万"
  } else {
    return Math.floor(count / 100000000) + "亿"
  }
}

// 防抖处理
export const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    if (timer) {
      clearInterval(timer);
    }
    timer = setInterval(() => {
      func.apply(this, args);
      clearInterval(timer);
    }, delay);
  }
}