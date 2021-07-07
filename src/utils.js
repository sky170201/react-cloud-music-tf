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

// 给 css3 相关属性增加浏览器前缀，处理浏览器兼容性问题
let elementStyle = document.createElement("div").style;
let vendor = (() => {
  // 首先通过 transition 属性判断是何种浏览器
  let transformNames = {
      webkit: "webkitTransform",
      Moz: "MozTransform",
      O: "OTransform",
      ms: "msTransform",
      standard: "Transform"
  };
  for (let key in transformNames) {
      if (elementStyle[transformNames[key]] !== undefined) {
          //返回当前浏览器的key
          return key;
      }
  }
  return false;
})();
export function prefixStyle(style) {
  if (vendor === false) {
      return false;
  }
  if (vendor === "standard") {
      return style;
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}

// 拼接出歌曲的url链接，用在audio属性上
export const getSongUrl = id => {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
}

// 转换播放歌曲的时间
export const formatPlayTime = interval => {
  interval = interval | 0; // | 0 表示向取整
  const minute = (interval / 60) | 0; // 分钟
  const second = (interval % 60).toString().padStart(2, '0'); // 秒
  return `${minute}:${second}`;
}

// ## 16.播放模式
// - 目前我们常见到的是三种播放模式
// - 单曲循环
// - 顺序循环
// - 随机播放

// 随机数
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
// 随机算法
export function shuffle(arr) {
  let newArr = [];
  arr.forEach(item => {
    newArr.push(item);
  })
  for (let i = 0; i < newArr.length; i ++) {
    let j = getRandomInt(0, i);
    let t = newArr[i]; // 为了方便进行交换
    newArr[i] = newArr[j];
    newArr[j] = t;
  }
  return newArr;
}

// 找当前的歌曲索引
export const findIndex = (song, list) => {
    return list.findIndex(item => {
        return song.id === item.id;
    })
}

// 播放模式
export const playMode = {
  sequence: 0,
  loop: 1,
  random: 2
}