import * as actionTypes from "./constants";
import { fromJS } from "immutable";
import { playMode } from "api/config";

const defaultState = fromJS({
    fullScreen: false,//是否为全屏模式
    playing: false,//当前歌曲是否播放
    sequencePlayList: [],//顺序列表，因为后续有循环模式或随机模式会打乱列表顺序，需要保存下顺序列表
    playList: [],//当前的歌曲列表
    mode: playMode.sequence,//播放模式
    currentIndex: -1,//当前歌曲在播放列表中的index
    showPlayList: false,//是否展示播放列表
    currentSong: {},//当前歌曲
});

export default (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.SET_CURRENT_SONG:
            return state.set('currentSong', action.data);
        case actionTypes.SET_FULL_SCREEN:
            return state.set('fullScreen', action.data);
        case actionTypes.SET_PLAYING_STATE:
            return state.set('playing', action.data);
        case actionTypes.SET_SEQUENCE_PLAYLIST:
            return state.set('sequencePlayList', action.data);
        case actionTypes.SET_PLAYLIST:
            return state.set('playList', action.data);
        case actionTypes.SET_PALY_MODE:
            return state.set('mode', action.data);
        case actionTypes.SET_CURRENT_INDEX:
            return state.set('currentIndex', action.data);
        case actionTypes.SET_SHOW_PLAYLIST:
            return state.set('showPlayList', action.data);
        default:
            return state;
    }
}