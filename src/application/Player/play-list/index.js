import React, { useRef, useState, useCallback } from "react";
import { connect } from "react-redux";
import { PlayListWrapper, ScrollWrapper, ListHeader, ListContent } from "./style";
import { prefixStyle,getName, shuffle, findIndex  } from 'utils';
import { changeShowPlayList, changeCurrentIndex, changePlayList, changePlayMode,deleteSong,
    changeSequencePlayList,changeCurrentSong,changePlayingState } from "../store/actionCreators";
import { CSSTransition } from "react-transition-group";
import Scroll from 'baseUI/scroll';
import { playMode } from "api/config";
import Confirm from "baseUI/confirm";

function PlayList(props) {
    const { showPlayList, currentIndex, currentSong: immutableCurrentSong, playList: immutablePlayList, mode, sequencePlayList: immutableSequencePlayList } = props;
    const currentSong = immutableCurrentSong.toJS();
    const playList = immutablePlayList.toJS();
    const sequencePlayList = immutableSequencePlayList.toJS();
    const { togglePlayListDispatch, changeCurrentIndexDispatch, changeModeDispatch, changePlayListDispatch } = props;
    const { clearDispatch } = props;
    const confirmRef = useRef();
    //清空列表前的弹框
    const handleShowClear = (event) => {//出现'是否全部删除'的弹框
        event.stopPropagation();
        event.preventDefault();
        confirmRef.current.show()
    }
    //清空歌曲列表的方法 传递给Confirm组件的方法
    const handleConfirmClear = () => {
        clearDispatch()
    }
    const playListRef = useRef();
    const listWrapperRef = useRef();
    const [isShow, setIsShow] = useState(false);
    const transform = prefixStyle("transform");
    const {deleteSongDispatch } = props;
    const handleDeleteSong = (e, song) => {
        e.stopPropagation();
        deleteSongDispatch(song);
    }
  //动画效果
  const onEnterCB = useCallback(() => {
      // 显示列表
      setIsShow(true);
      //一开始隐藏在下面
      listWrapperRef.current.style[transform] = `translate3d(0,100%,0)`;
  }, [transform]);

  const onEnteringCB = useCallback(() => {
      //列表展示
      listWrapperRef.current.style["transition"] = "all 0.3s";
      listWrapperRef.current.style[transform] = `translate3d(0,0,0)`;
  }, [transform]);

  const onExitingCB = useCallback(() => {
      listWrapperRef.current.style["transition"] = "all 0.3s";
      listWrapperRef.current.style[transform] = `translate3d(0,100%,0)`
  }, [transform]);

  const onExitedCB = useCallback(() => {
      setIsShow(false);
      listWrapperRef.current.style[transform] = `translate3d(0,100%,0)`
  }, [transform]);
  // 获取当前播放歌曲的图标
  const getCurrentIcon = (item) => {
      const current = currentSong.id === item.id;
      const className = current ? "icon-play" : "";
      const content = current ? "&#xe6e3;" : '';
      return (
          <i className={`current iconfont ${className}`} dangerouslySetInnerHTML={{ __html: content }}></i>
      )
  };
  //当前播放模式的图标和内容
  const getPlayMode = () => {
      let content, text;
      if (mode === playMode.sequence) {
          content = "&#xe625;";
          text = "顺序播放";
      } else if (mode === playMode.loop) {
          content = "&#xe653;";
          text = "单曲循环";
      } else {
          content = "&#xe61b;";
          text = "随机播放"
      }
      return (
          <div>
              <i className="iconfont" onClick={(e) => changeMode(e)} dangerouslySetInnerHTML={{ __html: content }}></i>
              <i className="text" onClick={(e) => changeMode(e)}>{text}</i>
          </div>
      )
  }
  //改变当前播放模式的方法
  const changeMode = () => {//后续实现
        let newMode = (mode + 1) % 3;
        if (newMode === 0) {
            // 顺序模式
            changePlayListDispatch(sequencePlayList);
            let index = findIndex(currentSong, sequencePlayList);
            changeCurrentIndexDispatch(index);
        } else if (newMode === 1) {
            // 单曲循环
            changePlayListDispatch(sequencePlayList);
        } else if (newMode === 2) {
            // 随机播放
            let newList = shuffle(sequencePlayList);
            let index = findIndex(currentSong, newList);
            changePlayListDispatch(newList);
            changeCurrentIndexDispatch(index);
        }
        changeModeDispatch(newMode);
  }

  //判断是否是当前歌曲，否则进行切歌
  const handleChangeCurrentIndex = (index) => {
    if (currentIndex === index) return;
    changeCurrentIndexDispatch(index);
  }

  // 获取scroll的dom元素
  const listContentRef = useRef();
  // 是否允许滑动事件生效
  const [canTouch, setCanTouch] = useState(true);
  //touchStart 后记录 y 值
  const [startY, setStartY] = useState(0);
  //touchStart 事件是否已经被触发
  const [initialed, setInitialed] = useState(0);
  // 用户下滑的距离
  const [distance, setDistance] = useState(0);
  //处理滑动事件
  const handleScroll = (pos) => {
      //只有当内容偏移量为0的时候才能下滑关闭PlayList。否则一边内容在移动，一边列表在移动，出现bug问题
      let state = pos.y === 0;
      setCanTouch(state);
  }

//   滑动开始前
const handleTouchStart = (e) => {
    if (!canTouch || initialed) return;
    listWrapperRef.current.style["transition"] = "";
    setStartY(e.nativeEvent.touches[0].pageY);//记录y值
    setInitialed(true);
}
// 滑动中
const handleTouchMove = (e) => {
    if (!canTouch || !initialed) return;
    let distance = e.nativeEvent.touches[0].pageY - startY;
    if (distance < 0) return;
    setDistance(distance);//记录下滑距离
    listWrapperRef.current.style.transform = `translate3d(0, ${distance}px, 0)`;
}
//滑动结束后
const handleTouchEnd = (e) => {
    setInitialed(false);//关闭触发滑动事件
    //这里设置阈值为150px
    if (distance >= 150) {
        //大于150px则关闭PlayList
        togglePlayListDispatch(false);
    } else {
        //否则反弹回去
        listWrapperRef.current.style["transition"] = "all 0.3s";
        listWrapperRef.current.style[transform] = `translate3d(0px, 0px, 0px)`;
    }
}

  return (
    <CSSTransition
      in={showPlayList}
      timeout={300}
      classNames="list-fade"
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExiting={onExitingCB}
      onExited={onExitedCB}
  >
      <PlayListWrapper ref={playListRef}
          style={isShow === true ? { display: "block" } : { display: "none" }}
          onClick={() => togglePlayListDispatch(false)}
      >
          <div className="list_wrapper"
            ref={listWrapperRef}
            onClick={e => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}>
            <ListHeader>
                <h1 className="title">
                    {getPlayMode()}
                    <span className="iconfont clear" onClick={handleShowClear}>&#xe63d;</span>
                </h1>
            </ListHeader>
            <ScrollWrapper>
                <Scroll
                    ref={listContentRef}
                    onScroll={pos => handleScroll(pos)}
                    bounceTop={false}>
                    <ListContent>
                        {
                            playList.map((item, index) => {
                                return (
                                    <li className="item"  key={item.id} onClick={() => handleChangeCurrentIndex(index)}>
                                        {getCurrentIcon(item)}
                                        <span className="text">{item.name} - {getName(item.ar)}</span>
                                        <span className="like">
                                            <i className="iconfont">&#xe601;</i>
                                        </span>
                                        <span className="delete" onClick={(e) => handleDeleteSong(e, item)}>
                                            <i className="iconfont">&#xe63d;</i>
                                        </span>
                                    </li>
                                )
                            })
                        }
                    </ListContent>
                </Scroll>
            </ScrollWrapper>
            <Confirm 
                ref={confirmRef}
                text={"是否删除全部"}
                cancelBtnText={"取消"}
                confirmBtnText={"确定"}
                handleConfirm={handleConfirmClear}
            />
          </div>
      </PlayListWrapper>
  </CSSTransition>
  )
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = state => ({
  showPlayList: state.getIn(['player', 'showPlayList']),//显示播放列表
  currentIndex: state.getIn(['player', 'currentIndex']),//当前索引
  currentSong: state.getIn(['player', 'currentSong']),//当前歌曲
  playList: state.getIn(['player', 'playList']),//歌曲列表
  sequencePlayList: state.getIn(['player', 'sequencePlayList']),//顺序排列的播放列表
  mode: state.getIn(['player', 'mode']),//播放模式
})
// 映射dispatch 到props上
const mapDispatchToProps = dispatch => {
  return {
      togglePlayListDispatch(data) {
          dispatch(changeShowPlayList(data))
      },
      // 修改当前歌曲列表中的index，进行切歌
      changeCurrentIndexDispatch(data) {
          dispatch(changeCurrentIndex(data))
      },
      //改变当前播放模式
      changeModeDispatch(data) {
          dispatch(changePlayMode(data))
      },
      //改变当前歌曲
      changePlayListDispatch(data) {
          dispatch(changePlayList(data))
      },
    //   删除歌曲
    deleteSongDispatch(data) {
        dispatch(deleteSong(data))
    },
    clearDispatch() {
        // 清空当前列表和顺序列表
        dispatch(changePlayList([]));
        dispatch(changeSequencePlayList([]));
        // 初始化currentIndex
        dispatch(changeCurrentIndex(-1))
        // 关闭歌曲列表
        dispatch(changeShowPlayList(false));
        // 当前歌曲置空
        dispatch(changeCurrentSong({}));
        // 重置播放状态
        dispatch(changePlayingState(false))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(PlayList));