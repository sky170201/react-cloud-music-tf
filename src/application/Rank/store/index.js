import { fromJS } from "immutable";
import { getRankListRequest } from "api/request";

// 动作常量
// 修改排行榜数据
export const CHANGE_RANK_LIST = "home/rank/CHANGE_RANK_LIST";
//修改排行榜loading
export const CHANGE_LOADING = "home/rank/CHANGE_LOADING";

// actionCreators
const changeRankList = (data) => ({
  type: CHANGE_RANK_LIST,
  data: fromJS(data)
})

//loading效果
const changeLoading = (data) => ({
  type: CHANGE_LOADING,
  data
})

//获取排行榜相关数据
export const getRankList = () => {
  return dispatch => {
      getRankListRequest().then(data => {
          let list = data && data.list;
          dispatch(changeRankList(list));
          dispatch(changeLoading(false))
      })
  }
}

// reducer
const dafaultState = fromJS({
  rankList: [], // 排行榜列表
  loading: true // loading效果
})

const reducer = (state = dafaultState, action) => {
  switch (action.type) {
    case CHANGE_RANK_LIST:
        return state.set("rankList", action.data);
    case CHANGE_LOADING:
        return state.set("loading", action.data);
    default:
        return state;
  }
}

export { reducer };