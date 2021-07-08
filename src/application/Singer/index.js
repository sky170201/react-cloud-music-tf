import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Container, ImgWrapper, CollectButton, SongListWrapper, BgLayer } from "./style";
import Header from "baseUI/header";
import Scroll from 'baseUI/scroll';
import { HEADER_HEIGHT } from "api/config";
import SongsList from "../SongsList";
import { connect } from "react-redux";
import { getSingerInfo, changeEnterLoading } from "./store/actionCreators";
import Loading from "baseUI/loading";
import MusicNote from "baseUI/music-note/index";

function Singer(props) {
  const [showStatus, setShowStatus] = useState(true);
  const setShowStatusFalse = useCallback(() => {
    setShowStatus(false);
  }, []);
  const musicNoteRef = useRef()
  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y })
  }
  const collectButton = useRef(); // 收藏按钮
  const imageWrapper = useRef(); // 图片容器
  const songScrollWrapper = useRef(); // 歌曲滚动组件包裹
  const songScroll = useRef();  //滚动组件
  const header = useRef();//头部
  const layer = useRef();//遮罩层
  // 图片初始化高度
  const initialHeight = useRef(0);
  // 往上偏移的尺寸
  const OFFSET = 5;
  const { artist: immutableArtist, songs: immutableSongs, loading } = props;
  const artist = immutableArtist.toJS();
  const songs = immutableSongs.toJS();
  const { getSingerDataDispatch } = props;
  useEffect(() => {
      const id=props.match.params.id;
      getSingerDataDispatch(id);
      let offsetHeight = imageWrapper.current.offsetHeight;
      songScrollWrapper.current.style.top = `${offsetHeight - OFFSET}px`;
      initialHeight.current = offsetHeight;
      // 遮罩放在下面，来包住歌曲
      layer.current.style.top = `${offsetHeight - OFFSET}px`;
      songScroll.current.refresh();
    }, [getSingerDataDispatch, props.match.params.id])

    const handleScroll = useCallback(pos => {
        let height = initialHeight.current;//图片初始化高度
        const newY = pos.y;
        const imageDOM = imageWrapper.current;//图片的包裹DOM
        const buttonDOM = collectButton.current;//收藏按钮
        const headerDOM = header.current;//头部的导航
        const layerDOM = layer.current;//遮罩层
        const minScrollY = HEADER_HEIGHT - (height - OFFSET);//最小
        //滑动距离占图片的百分比
        const percent = Math.abs(newY / height);
        // 处理往下拉的情况
        if (newY > 0) {
            imageDOM.style["transform"] = `scale(${1 + percent})`;//缩放
            buttonDOM.style["transform"] = `translate3d(0,${newY}px,0)`;//收藏按钮也要移动
            layerDOM.style.top = `${height - OFFSET + newY}px`;//遮罩层的top值
        }
        // 往上滑动，遮罩层没有超过头部
        else if (newY >= minScrollY) {
            layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`;
            // 需要保证遮罩层的级别比图片低，不能遮挡图片
            layerDOM.style.zIndex = 1;
            imageDOM.style.paddingTop = "75%";
            imageDOM.style.height = 0;
            imageDOM.style.zIndex = -1;
            // 收藏按钮跟着移动并且逐渐变透明
            buttonDOM.style["transform"] = `translate3d(0,${newY}px,0)`;
            buttonDOM.style["opacity"] = `${1 - percent * 2}`;
        }
        // 继续往上滑，遮罩层超过头部
        else if (newY < minScrollY) {
            layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`;
            layerDOM.style.zIndex = 1;
            // 防止溢出的歌单内容遮住头部
            headerDOM.style.zIndex = 100;
            // 图片高度和头部一致
            imageDOM.style.height = `${HEADER_HEIGHT}px`;
            imageDOM.style.paddingTop = 0;
            imageDOM.style.zIndex = 99;
        }
    }, [])

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={() => props.history.goBack()}>
        <Container>
          <Header title={artist.name} handleClick={setShowStatusFalse} ref={header}></Header>
          <ImgWrapper bgUrl={artist.picUrl} ref={imageWrapper}>
              <div className="filter"></div>
          </ImgWrapper>
          <CollectButton ref={collectButton}>
              <i className="iconfont">&#xe62d;</i>
              <span className="text">收藏</span>
          </CollectButton>
          <BgLayer ref={layer}/>
          <SongListWrapper ref={songScrollWrapper}>
              {/* 歌曲部分列表 */}
              <Scroll ref={songScroll} onScroll={handleScroll}>
              <SongsList
                    songs={songs}
                    showCollect={false}
                    musicAnimation={musicAnimation}
                ></SongsList>
              </Scroll>
          </SongListWrapper>
          {loading && <Loading/>}
          <MusicNote ref={musicNoteRef}></MusicNote>
        </Container>
    </CSSTransition>
  )
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
    artist: state.getIn(['singerInfo', 'artist']),
    songs: state.getIn(["singerInfo", "songsOfArtist"]),
    loading: state.getIn(['singerInfo', 'loading']),
})

// 映射 dispatch到props上
const mapDispatchToProps = (dispatch) => {
    return {
        getSingerDataDispatch(id) {
            dispatch(changeEnterLoading(true))
            dispatch(getSingerInfo(id))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singer));
