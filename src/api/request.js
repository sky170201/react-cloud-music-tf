import { axiosInstance } from './config';

//轮播图数据
export const getBannerRequest = () => {
  return axiosInstance.get(`/banner`)
}

//推荐歌单列表数据
export const getRecommendListRequest = () => {
  return axiosInstance.get(`/personalized`)
}