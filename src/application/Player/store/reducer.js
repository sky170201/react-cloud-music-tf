import * as actionTypes from "./constants";
import { fromJS } from "immutable";
import { playMode } from "api/config";
import { findIndex } from "utils"

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
        case actionTypes.DELETE_SONG:
            return handleDeleteSong(state, action.data);
        default:
            return state;
    }
}

const handleDeleteSong = (state, song) => {
    // 也可用 lodash 库的 deepClone 方法。这里深拷贝是基于纯函数的考虑，不对参数 state 做修改
    const playList = JSON.parse(JSON.stringify(state.get('playList').toJS()));
    const sequenceList = JSON.parse(JSON.stringify(state.get('sequencePlayList').toJS()));
    let currentIndex = state.get('currentIndex');
    // 找对应歌曲在播放列表中的索引
    console.log(song, playList);
    const fpIndex = findIndex(song, playList);
    // 在播放列表中将其删除
    playList.splice(fpIndex, 1);
    // 如果删除的歌曲排在当前播放歌曲前面，那么 currentIndex--，让当前的歌正常播放
    if (fpIndex < currentIndex) currentIndex--;
    // 在 sequenceList 中直接删除歌曲即可
    const fsIndex = findIndex(song, sequenceList);
    sequenceList.splice(fsIndex, 1);
    return state.merge({//数据合并
        'playList': fromJS(playList),
        'sequencePlayList': fromJS(sequenceList),
        'currentIndex': fromJS(currentIndex),
    });
}