import * as actionTypes from "./constants";
import { fromJS } from "immutable";//把js数据结果转换成immutable数据结构
import { getBannerRequest, getRecommendListRequest } from "api/request";//获取请求数据

export const changeBannerList = (data) => ({
  type: actionTypes.CHANGE_BANNER,
  data: fromJS(data)
})

export const changeRecommendList = (data) => ({
  type: actionTypes.CHANGE_RECOMMEND_LIST,
  data: fromJS(data)
})

export const getBannerList = () => {
  return (dispatch) => {
    getBannerRequest().then(data => {
      dispatch(changeBannerList(data.banners))
    }).catch(() => {
      console.log('轮播图数据传输失败')
    })
  }
}

export const getRecommendList = () => {
  return (dispatch) => {
      getRecommendListRequest().then(data => {
          dispatch(changeRecommendList(data.result))
          dispatch(changeEnterLoading(false))//结束loading
      }).catch(() => {
          console.log("推荐歌单数据传输失败")
      })
  }
}

export const changeEnterLoading=(data)=>({
    type:actionTypes.CHANGE_ENTER_LOADING,
    data //简单数据类型不需要fromJS被包裹
})