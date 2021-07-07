import React, { useRef } from "react";
import { getName } from "utils";
import { NormalPlayerContainer, Top, Middle, Bottom, Operators, CDWrapper,ProgressWrapper } from "./style";
import { CSSTransition } from "react-transition-group";
import animations from "create-keyframe-animation";
import { prefixStyle, formatPlayTime } from "utils";
import ProgressBar from "baseUI/progress-bar";
import { playMode } from 'api/config';
function NormalPlayer(props) {
    const { song, fullScreen,playing, percent, duration, currentTime, mode } = props;
    // 给菜单绑定上一曲和下一曲事件处理函数
    const { toggleFullScreen,clickPlaying, onProgressChange, handlePrev, handleNext, changeMode } = props;
    // 歌曲模式改变之后的按钮图标变化
    const getPlayMode = () => {
        let content;
        if (mode == playMode.sequence) {
            content = "&#xe625;";
        } else if (mode === playMode.loop) {
            content = "&#xe653;";
        } else {
            content = "&#xe61b;";
        }
        return content;
    }
    const normalPlayerRef = useRef();
    const cdWrapperRef = useRef();
    const transform = prefixStyle("transform");//添加浏览器前缀
     // 帧动画效果
     const enter = () => {
        normalPlayerRef.current.style.display = "block";
        // 获取miniPlayer图片中心相对于normalPlayer 唱片中线的偏移量
        const { x, y, scale } = _getPosAndScale();
        //定义动画内容
        let animation = {
            0: {
                transform: `translate3d(${x} px,${y} px,0) scale(${scale})`
            },
            60: {
                transform: `translate3d(0,0,0) scale(1.1)`
            },
            100: {
                transform: `translate3d(0,0,0) scale(1)`
            }
        };
        // 注册动画
        animations.registerAnimation({
            name: "move",//动画名字
            animation,//动画效果
            presets: {//预设项
                duration: 400,//持续时间
                easing: "linear",//时间函数
            }
        });
        //运行动画，第一参数为dom元素，第二参数是动画名称，第三参数是动画完成后的执行回调函数
        animations.runAnimation(cdWrapperRef.current, "move")
    }
    // 计算偏移的辅助函数
    const _getPosAndScale = () => {
        const targetWidth = 40;
        const paddingLeft = 40;
        const paddingBottom = 30;
        const paddingTop = 80;
        const width = window.innerWidth * 0.8; //长宽一致
        const scale = targetWidth / width;
        // 两个圆心的横坐标和纵坐标距离
        const x = -(window.innerWidth / 2 - paddingLeft);
        const y = window.innerHeight - paddingTop - paddingBottom - width / 2;
        return { x, y, scale }
    }
    const afterEnter = () => {
        // 进入后解绑动画并且没有动画效果
        const cdWrapperDOM = cdWrapperRef.current;
        animations.unregisterAnimation("move");
        cdWrapperDOM.style.animation = ""
    }
    const leave = () => {
        if (!cdWrapperRef.current) return;
        const cdWrapperDOM = cdWrapperRef.current;
        cdWrapperDOM.style.transition = "all 0.4s";
        const { x, y, scale } = _getPosAndScale();
        cdWrapperDOM.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
    }
    const afterLeave = () => {
        if (!cdWrapperRef.current) return;
        //没有动画效果
        const cdWrapperDOM = cdWrapperRef.current;
        cdWrapperDOM.style.transition = "";
        cdWrapperDOM.style[transform] = "";
        // normalPlayer这个dom一定要隐藏掉，否则一直存在
        normalPlayerRef.current.style.display = "none";
    }
    return (
        <CSSTransition
            classNames="normal"
            in={fullScreen}
            timeout={400}
            mountOnEnter
            onEnter={enter}
            onEntered={afterEnter}
            onExit={leave}
            onExited={afterLeave}
        >
            <NormalPlayerContainer ref={normalPlayerRef}>
                <div className="background">
                    <img src={song.al.picUrl +  "?param=300x300"} width="100%" height="100%" alt="normal-img" />
                </div>
                <div className="background layer"></div>
                <Top className="top">
                    <div className="back" onClick={()=>{toggleFullScreen(false)}}>
                        <i className="iconfont">&#xe662;</i>
                    </div>
                    <h1 className="title">{song.name}</h1>
                    <h1 className="subtitle">{getName(song.ar)}</h1>
                </Top>
                <Middle>
                    <CDWrapper ref={cdWrapperRef}>
                        <div className="cd">
                            <img
                                className={`image play ${playing ? "" : "pause"}`}
                                src={song.al.picUrl +  "?param=400x400"}
                                alt="normal-img22"
                            />
                        </div>
                    </CDWrapper>
                </Middle>
                <Bottom className="bottom">
                    <ProgressWrapper>
                    <span className="time time-l">{formatPlayTime(currentTime)}</span>
                       <div className="progress-bar-wrapper">
                       <ProgressBar percent={percent} percentChange={onProgressChange}></ProgressBar>
                       </div>
                       <div className="time time-r">{formatPlayTime(duration)}</div>
                   </ProgressWrapper>
                    <Operators>
                        <div className="icon i-left" onClick={changeMode}>
                            <i className="iconfont" dangerouslySetInnerHTML={{ __html: getPlayMode() }}></i>
                        </div>
                        <div className="icon i-left" onClick={handlePrev}>
                            <i className="iconfont">&#xe6e1;</i>
                        </div>
                        {/* 中间暂停按钮 */}
                        <div className="icon i-center">
                            <i
                                className="iconfont"
                                onClick={e => clickPlaying(e, !playing)}
                                dangerouslySetInnerHTML={{ __html: playing ? "&#xe723;" : "&#xe731;"}}
                                ></i>
                        </div>
                        <div className="icon i-right" onClick={handleNext}>
                            <i className="iconfont">&#xe718;</i>
                        </div>
                        <div className="icon i-right">
                            <i className="iconfont">&#xe640;</i>
                        </div>
                    </Operators>
                </Bottom>
            </NormalPlayerContainer>
        </CSSTransition>
    )
}
export default React.memo(NormalPlayer)