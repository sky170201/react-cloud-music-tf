import { axiosInstance } from './config';

//轮播图数据
export const getBannerRequest = () => {
  return axiosInstance.get(`/banner`)
}

//推荐歌单列表数据
export const getRecommendListRequest = () => {
  return axiosInstance.get(`/personalized`)
}

//获取热门歌手列表数据
export const getHotSingerListRequest = (count) => {
  return axiosInstance.get(`/top/artists?offset=${count}`)
}

//获取歌手列表数据
export const getSingerListRequest = (category, alpha, count) => {
  return axiosInstance.get(`/artist/list?cat=${category}&initial=${alpha.toLowerCase()}&offset=${count}`);
}

// 获取排行榜数据
export const getRankListRequest = () => {
  return axiosInstance.get(`/toplist/detail`)
}