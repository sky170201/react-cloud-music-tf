import { getHotSingerListRequest, getSingerListRequest } from "api/request";
import { CHANGE_SINGER_LIST, CHANGE_PAGE_COUNT, CHANGE_ENTER_LOADING, CHANGE_PULLUP_LOADING, CHANGE_PULLDOWN_LOADING } from "./constants";
import { fromJS } from "immutable";

//修改歌手列表
const changeSingerList = (data) => ({
  type: CHANGE_SINGER_LIST,
  data: fromJS(data),
})
//修改页数
export const changePageCount = (data) => ({
  type: CHANGE_PAGE_COUNT,
  data
})

// 进场loading
export const changeEnterLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  data
})

// 底部上拉的loading
export const changePullUpLoading = (data) => ({
  type: CHANGE_PULLUP_LOADING,
  data
})

//顶部下拉的loading
export const changePullDownLoading = (data) => ({
  type: CHANGE_PULLDOWN_LOADING,
  data
})

//第一次加载热门歌手
export const getHotSingerList = () => {
  return (dispatch) => {
    getHotSingerListRequest(0).then(res => {
        const data = res.artists;
        dispatch(changeSingerList(data));
        dispatch(changeEnterLoading(false));
        dispatch(changePullDownLoading(false));
    }).catch(() => {
        console.log("热门歌手获取数据失败")
    })
  }
}

//加载更多的热门歌手
export const refreshMoreHotSingerList = () => {
  return (dispatch, getState) => {
      const pageCount = getState().getIn(["singers", "pageCount"]);
      const singerList = getState().getIn(["singers", "singerList"]).toJS();
      getHotSingerListRequest(pageCount).then(res => {
          const data = [...singerList, ...res.artists];
          dispatch(changeSingerList(data));
          dispatch(changePullUpLoading(false));
      }).catch(() => {
          console.log("热门歌手加载失败")
      })
  }
}

//第一次加载时，关闭进场的loading和pullDown(顶部下拉)的loading;
//加载更多的时候，关闭pullUp(底部上拉)的loading
//第一次加载相应类别歌手
export const getSingerList = (category, alpha) => {
  return (dispatch, getState) => {
      getSingerListRequest(category, alpha, 0).then(res => {
          const data = res.artists;
          dispatch(changeSingerList(data));
          dispatch(changeEnterLoading(false));
          dispatch(changePullDownLoading(false));//顶部下拉loading结束
      })
  }
}

//加载更多类别歌手
export const refreshMoreSingerList = (category, alpha) => {
  return (dispatch, getState) => {
      const pageCount = getState().getIn(["singers", "pageCount"])
      const singerList = getState().getIn(["singers", "singerList"]).toJS();
      getSingerListRequest(category, alpha, pageCount).then(res => {
        const data = [...singerList, ...res.artists];
        console.log(data)
          dispatch(changePageCount(pageCount));
          dispatch(changePullUpLoading(false));//底部上拉loading结束
      }).catch(() => {
          console.log("歌手获取数据失败")
      })
  }
}