import axios from 'axios';

export const baseUrl = "http://47.97.249.134:3000";

const axiosInstance = axios.create({
  baseURL: baseUrl
})

axiosInstance.interceptors.response.use(
  res => res.data,
  err => {
      console.log("网络错误", err)
  }
)
export { axiosInstance };

// 歌手种类
export const categoryTypes = [{
    name: "华语男",
    key: "1001"
},
{
    name: "华语女",
    key: "1002"
},
{
    name: "华语组合",
    key: "1003"
},
{
    name: "欧美男",
    key: "2001"
},
{
    name: "欧美女",
    key: "2002"
},
{
    name: "欧美组合",
    key: "2003"
},
{
    name: "日本男",
    key: "6001"
},
{
    name: "日本女",
    key: "6002"
},
{
    name: "日本组合",
    key: "6003"
},
{
    name: "韩国男",
    key: "7001"
},
{
    name: "韩国女",
    key: "7002"
},
{
    name: "韩国组合",
    key: "7003"
},
{
    name: "其他男歌手",
    key: "4001"
},
{
    name: "其他女歌手",
    key: "4002"
},
{
    name: "其他组合",
    key: "4003"
},
];

// 歌手首字母
export const alphaTypes = [{
    key: "A",
    name: "A"
},
{
    key: "B",
    name: "B"
},
{
    key: "C",
    name: "C"
},
{
    key: "D",
    name: "D"
},
{
    key: "E",
    name: "E"
},
{
    key: "F",
    name: "F"
},
{
    key: "G",
    name: "G"
},
{
    key: "H",
    name: "H"
},
{
    key: "I",
    name: "I"
},
{
    key: "J",
    name: "J"
},
{
    key: "K",
    name: "K"
},
{
    key: "L",
    name: "L"
},
{
    key: "M",
    name: "M"
},
{
    key: "N",
    name: "N"
},
{
    key: "O",
    name: "O"
},
{
    key: "P",
    name: "P"
},
{
    key: "Q",
    name: "Q"
},
{
    key: "R",
    name: "R"
},
{
    key: "S",
    name: "S"
},
{
    key: "T",
    name: "T"
},
{
    key: "U",
    name: "U"
},
{
    key: "V",
    name: "V"
},
{
    key: "W",
    name: "W"
},
{
    key: "X",
    name: "X"
},
{
    key: "Y",
    name: "Y"
},
{
    key: "Z",
    name: "Z"
}
];

//排行榜编号
export const RankTypes = {
    "0": "新歌榜",
    "1": "热歌榜",
    "2": "原创榜",
    "3": "飙升榜",
    "4": "黑胶VIP爱听榜",
    "5": "云音乐说唱榜",
    "6": "云音乐古典榜",
    "7": "云音乐电音榜",
    "8": "云音乐ACG榜",
    "9": "云音乐韩语榜",
    "10": "云音乐国电榜",
    "11": "UK排行榜周榜",
    "12": "美国Billboard榜",
    "13": "KTV唛榜",
    "14": "iTunes榜",
    "15": "日本Oricon榜",
    "16": "中国新乡村音乐排行榜",
    "17": "云音乐ACG VOCALOID榜",
    "18": "云音乐摇滚榜",
    "19": "云音乐古风榜",
    "20": "潜力爆款榜",
    "21": "云音乐民谣榜",
    "22": "云音乐ACG音乐榜",
    "23": "听歌识曲榜",
    "24": "网络热歌榜",
    "25": "俄语榜",
    "26": "越南语榜",
    "27": "云音乐欧美新歌榜",
    "28": "云音乐ACG动画榜",
    "29": "法国 NRJ Vos Hits 周榜",
    "30": "云音乐欧美热歌榜",
    "31": "Beatport全球电子舞曲榜",
    "32": "云音乐ACG游戏榜",
};

export const HEADER_HEIGHT = 45;

// 播放模式
export const playMode = {
    sequence: 0,  //顺序
    loop: 1,      //循环
    random: 2,    //随机
}