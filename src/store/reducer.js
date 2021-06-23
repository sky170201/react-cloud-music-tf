import { combineReducers } from 'redux-immutable';
import { reducer as recommendReducer } from '../application/Recommend/store/index'
import { reducer as singersReducer } from "../application/Singers/store/index";
import { reducer as rankReducer } from "../application/Rank/store/index";
// 合并不同模块的reducer
export default combineReducers({
  // 开发具体功能模块的时候添加合并不同模块的reducer
  recommend: recommendReducer,
  singers: singersReducer,
  rank: rankReducer
})