import * as actionTypes from './constants';
// 把JS 数据结构转化immutable 数据结构
import { fromJS } from 'immutable';

const defaultState = fromJS({
  singerList: [],//歌手列表的信息
  enterLoading: true,//进场的loading
  pullUpLoading: false,//上拉加载动画
  pullDownLoading: false,//下拉加载动画
  pageCount: 0,//默认当前页数
})

// 因为使用的是immutable数据结构，所以使用get和set来获取数据和设置状态
export default (state = defaultState, action) => {
  switch (action.type) {
      case actionTypes.CHANGE_SINGER_LIST:
          return state.set("singerList", action.data);
      case actionTypes.CHANGE_PAGE_COUNT:
          return state.set("pageCount", action.data);
      case actionTypes.CHANGE_ENTER_LOADING:
          return state.set("enterLoading", action.data);
      case actionTypes.CHANGE_PULLUP_LOADING:
          return state.set("pullUpLoading", action.data);
      case actionTypes.CHANGE_PULLDOWN_LOADING:
          return state.set("pullDownLoading", action.data);
      default:
          return state;
  }
}