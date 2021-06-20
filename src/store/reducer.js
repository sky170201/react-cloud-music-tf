import { combineReducers } from 'redux-immutable';
import { reducer as recommendReducer } from '../application/Recommend/store/index'
// 合并不同模块的reducer
export default combineReducers({
  // 开发具体功能模块的时候添加reducer
  recommend: recommendReducer
})