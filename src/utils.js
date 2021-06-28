import { RankTypes } from './api/config'

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

// 处理数据的时候，找出第一个没有歌名的排行榜的索引 -- 区分官方榜和全球榜
export const filterIndex = rankList => {
  for (let i = 0; i <  rankList.length - 1; i ++) {
    if (rankList[i].tracks.length && !rankList[i + 1].tracks.length) {
      return i + 1;
    }
  }
}

// 找出排行榜的编号
export const filterIdx = name => {
  for (let key in RankTypes) {
    if (RankTypes[key] === name) {
      return key;
    }
    return null;
  }
}

// 拼接歌手字符串
export const getName = list => {
  let str = "";
  list.map((item, index) => {
    str += index === 0 ? item.name : "/" + item.name;
    return item
  })
  return str
}

export const isEmptyObject = obj => !obj || Object.keys(obj).length === 0;