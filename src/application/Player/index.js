import React, { useState, useRef, useEffect } from "react";
import {
    changeCurrentIndex, changeCurrentSong, changeFullScreen, changePlayList,
    changePlayMode, changePlayingState, changeSequencePlayList, changeShowPlayList
} from "./store/actionCreators";
import { connect } from "react-redux";
import MiniPlayer from "./miniPlayer/index";
import NormalPlayer from "./normalPlayer/index";
import { getSongUrl, isEmptyObject, shuffle, findIndex, playMode } from "utils";
import Toast from "baseUI/Toast/index";
import PlayList from "./play-list/index";
function Player(props) {
    const { fullScreen, playing = false, currentSong: immutableCurrentSong, currentIndex = -1,
        playList: immutablePlayList, mode, sequencePlayList: immutableSequencePlayList } = props;
    const { togglePlayListDispatch } = props;
    const currentSong = immutableCurrentSong.toJS();//获取当前歌曲
    let sequencePlayList = immutableSequencePlayList.toJS();
    let playList = immutablePlayList.toJS();
    const { toggleFullScreenDispatch, togglePlayingDispatch, changeCurrentIndexDispatch,
        changeCurrentDispatch, changePlayListDispatch, changeModeDispatch } = props;
    // 当前歌曲是否播放，没有播放的话不需要重新渲染页面了
    const [songReady, setSongReady] = useState(true);
    // 显示当前的播放模式文本
    const [modeText, setModeText] = useState("")
    //获取显示文本的元素
    const toastRef = useRef();
    // 改变播放模式的方法
    const changeMode = () => {
        let newMode = (mode + 1) % 3;
        if (newMode === 0) {
            //顺序模式
            changePlayListDispatch(sequencePlayList);
            let index = findIndex(currentSong, sequencePlayList);
            changeCurrentIndexDispatch(index);
            setModeText("顺序循环")
        } else if (newMode === 1) {
            //单曲循环
            changePlayListDispatch(sequencePlayList);
            setModeText("单曲循环")
        } else if (newMode === 2) {
            //随机播放
            let newList = shuffle(sequencePlayList);
            console.log(newList.map(item => (item.name + item.id)));
            let index = findIndex(currentSong, newList);
            changePlayListDispatch(newList);
            changeCurrentIndexDispatch(index);
            setModeText("随机循环")
        }
        changeModeDispatch(newMode);
        toastRef.current.show();
    }
    //处理audio的播放完毕之后的事件
    const handleEnd = () => {
        //单曲循环的继续循环，否则播放下一首
        if (mode === playMode.loop) {
            handleLoop()
        } else {
            handleNext()
        }
    }
    const clickPlaying = (e, state) => {
        e.stopPropagation();
        togglePlayingDispatch(state)
    }
    //目前播放时间
    const [currentTime, setCurrentTime] = useState(0);
    //歌曲的总长度
    const [duration, setDuration] = useState(0);
    //歌曲播放进度
    let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;
    //audio元素
    const audioRef = useRef();//核心技术
    const [preSong, setPreSong] = useState({});
    useEffect(() => {
        if (!currentSong
            || currentIndex === -1
            || !playList[currentIndex]
            || playList[currentIndex].id === preSong.id
            || !songReady)
            return;
        changeCurrentIndexDispatch(currentIndex);//currentIndex默认是-1，需要改成0
        let current = playList[currentIndex];//获取歌曲列表当前索引对应的歌曲
        changeCurrentDispatch(current);
        setPreSong(current);
        setSongReady(false);
        audioRef.current.src = getSongUrl(current.id);
        setCurrentTime(0);//从零播放
        setDuration((current.dt / 1000) | 0);//播放时长
        setTimeout(() => {
            audioRef.current.play().then(()=> {
                setSongReady(true);
            });
        });
    }, [playList, currentIndex, currentSong, preSong.id, songReady, changeCurrentIndexDispatch, changeCurrentDispatch])
    // 监听playing的变化
    useEffect(() => {
        playing ? audioRef.current.play() : audioRef.current.pause();
    }, [playing]);
    // 更新currentTime(当前播放时间)事件
    const updateTime = (e) => {
        setCurrentTime(e.target.currentTime)
    }
    // 监听进度条的事件
    const onProgressChange = curPercent => {
        const newTime = curPercent * duration;
        setCurrentTime(newTime)
        audioRef.current.currentTime = newTime;
        if (!playing) {
            togglePlayingDispatch(true);
        }
    }
    //单歌曲循环
    const handleLoop = () => {
        audioRef.current.currentTime = 0;
        if (!playing) togglePlayingDispatch(true);
        audioRef.current.play()
    }
    //切换上一首歌曲
    const handlePrev = () => {
        // 如果只有一首歌曲就是单曲循环
        if (playList.length === 1) {
            handleLoop();
            return;
        }
        let index = currentIndex - 1;
        //如果是第一首歌曲，切换上一首的时候就切换到歌曲列表中最后一首歌曲
        if (index < 0) index = playList.index - 1;
        if (!playing) togglePlayingDispatch(true);//一直播放
        changeCurrentIndexDispatch(index);
    }
    //切换下一首
    const handleNext = () => {
        // 如果只有一首歌的时候就是单曲循环
        if (playList.length === 1) {
            handleLoop();
            return;
        }
        let index = currentIndex + 1;
        //如果是最后一首歌曲，切换到下一首歌是该歌曲列表的第一首歌曲
        if (index === playList.length) index = 0;
        if (!playing) togglePlayingDispatch(true);//一直播放
        changeCurrentIndexDispatch(index);
    }
    return (
        <div>
            {isEmptyObject(currentSong) ? null : <NormalPlayer
                song={currentSong}
                fullScreen={fullScreen}
                toggleFullScreen={toggleFullScreenDispatch}
                playing={playing}
                clickPlaying={clickPlaying}
                percent={percent}
                duration={duration}
                currentTime={currentTime}
                onProgressChange={onProgressChange}
                handlePrev={handlePrev}
                handleNext={handleNext}
                mode={mode}
                changeMode={changeMode}
                togglePlayList={togglePlayListDispatch}
            />}

            {isEmptyObject(currentSong) ? null : <MiniPlayer
                song={currentSong}
                fullScreen={fullScreen}
                toggleFullScreen={toggleFullScreenDispatch}
                playing={playing}
                clickPlaying={clickPlaying}
                percent={percent}
                togglePlayList={togglePlayListDispatch}
            />}
            <audio ref={audioRef} onTimeUpdate={updateTime} onEnded={handleEnd}></audio>
            <PlayList/>
            <Toast text={modeText} ref={toastRef}></Toast>
        </div>
    )
}
// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
    fullScreen: state.getIn(['player', 'fullScreen']),
    playing: state.getIn(['player', 'playing']),
    currentSong: state.getIn(['player', 'currentSong']),
    showPlayList: state.getIn(['player', 'showPlayList']),
    mode: state.getIn(['player', 'mode']),
    currentIndex: state.getIn(['player', 'currentIndex']),
    playList: state.getIn(['player', 'playList']),
    sequencePlayList: state.getIn(['player', 'sequencePlayList']),
})
//映射dispatch 到props上
const mapDispatchToProps = (dispatch) => {
    return {
        togglePlayingDispatch(data) {
            dispatch(changePlayingState(data))
        },
        toggleFullScreenDispatch(data) {
            dispatch(changeFullScreen(data))
        },
        togglePlayListDispatch(data) {
            dispatch(changeShowPlayList(data))
        },
        changeCurrentIndexDispatch(index) {
            dispatch(changeCurrentIndex(index))
        },
        changeCurrentDispatch(data) {
            dispatch(changeCurrentSong(data))
        },
        changeModeDispatch(data) {
            dispatch(changePlayMode(data))
        },
        changePlayListDispatch(data) {
            dispatch(changePlayList(data))
        }
    }
}

// ui组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player));