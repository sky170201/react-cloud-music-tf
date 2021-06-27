import React, { useState, useRef } from "react";
import { Container, TopDesc, Menu, SongList, SongItem } from "./style";
import { CSSTransition } from 'react-transition-group';
import Header from "baseUI/header";
import Scroll from "baseUI/scroll/index";
import { getCount, getName } from 'utils';
import { HEADER_HEIGHT } from "api/config";
import style from "assets/global-style";

function Album(props) {
     const [title, setTitle] = useState("");//title文本内容
 const [isMarquee, setIsMarquee] = useState(false);//跑马灯
 const headerEl = useRef();//获取header组件的元素
    // 关于滑动组件和跑马灯的处理
    const handleScroll = (pos) => {
        // pos为滑动时的坐标
        console.log(pos)
        let minScrollY = -HEADER_HEIGHT;//默认顶部的高度(最小)
        let percent = Math.abs(pos.y / minScrollY);//取百分比的绝对值
        let headerDOM = headerEl.current;//获取Header组件的DOM元素
        // 滑过顶部的高度开始变化
        if (pos.y < minScrollY) {//完全滑过最小高度的时候
            headerDOM.style.backgroundColor = style["theme-color"];
            headerDOM.style.opacity = Math.min(1, (percent - 1) / 2);//通过透明度的变化来渐变颜色
            setTitle(currentAlbum.name)//修改标题
            setIsMarquee(true);//跑马灯效果出现
        } else { // 没有滑动太多的高度的时候，没有什么变化
            headerDOM.style.backgroundColor = "";
            headerDOM.style.opacity = 1;
            setTitle("")
            setIsMarquee(false)
        }
    }
    const [showStatus, setShowStatus] = useState(true);
    const handleBack = () => {
        setShowStatus(false);
    }
    const currentAlbum = {
        creator: {
            avatarUrl: "http://p1.music.126.net/O9zV6jeawR43pfiK2JaVSw==/109951164232128905.jpg",
            nickname: "你好世界!",
        },
        coverImgUrl: "http://p2.music.126.net/ecpXnH13-0QWpWQmqlR0gw==/109951164354856816.jpg",
        subscribedCount: 2010711,
        name: "明天是个好天气，来得及去观赏，好风景!",
        tracks: [
            {
                name: "大鱼",
                ar: [{ name: "周深" }, { name: "海棠" }],
                al: {
                    name: "大鱼海棠"
                }
            },
            {
                name: "大鱼",
                ar: [{ name: "周深" }, { name: "海棠" }],
                al: {
                    name: "大鱼海棠"
                }
            },
            {
                name: "大鱼",
                ar: [{ name: "周深" }],
                al: {
                    name: "大鱼海棠"
                }
            },
            {
                name: "大鱼",
                ar: [{ name: "周深" }, { name: "海棠" }],
                al: {
                    name: "大鱼海棠"
                }
            },
            {
                name: "大鱼",
                ar: [{ name: "周深" }, { name: "海棠" }],
                al: {
                    name: "大鱼海棠"
                }
            },
            {
                name: "大鱼",
                ar: [{ name: "周深" }],
                al: {
                    name: "大鱼海棠"
                }
            },
            {
                name: "大鱼",
                ar: [{ name: "周深" }, { name: "海棠" }],
                al: {
                    name: "大鱼海棠"
                }
            },
            {
                name: "大鱼",
                ar: [{ name: "周深" }, { name: "海棠" }],
                al: {
                    name: "大鱼海棠"
                }
            },
            {
                name: "大鱼",
                ar: [{ name: "周深" }],
                al: {
                    name: "大鱼海棠"
                }
            },
            {
                name: "大鱼",
                ar: [{ name: "周深" }, { name: "海棠" }],
                al: {
                    name: "大鱼海棠"
                }
            },
        ]
    }
    // 顶部栏
    const renderTopDesc = () => {
        return (
            <TopDesc background={currentAlbum.coverImgUrl}>
                <div className="background">
                    <div className="filter"></div>
                </div>
                <div className="img_wrapper">
                    <div className="decorate"></div>
                    <img src={currentAlbum.coverImgUrl} alt="" />
                    <div className="play_count">
                        <i className="iconfont play">&#xe885;</i>
                        <span className="count">{Math.floor(currentAlbum.subscribedCount / 10000)}万</span>
                    </div>
                </div>
                <div className="desc_wrapper">
                    <div className="title">{currentAlbum.name}</div>
                    <div className="person">
                        <div className="avatar">
                            <img src={currentAlbum.creator.avatarUrl} alt="small-music" />
                        </div>
                        <div className="name">{currentAlbum.creator.nickname}</div>
                    </div>
                </div>
            </TopDesc>
        )
    }
    //菜单栏
    const renderMenu = () => {
        return (
            <Menu>
                <div><i className="iconfont">&#xe6ad;</i>评论</div>
                <div><i className="iconfont">&#xe86f;</i>点赞</div>
                <div><i className="iconfont">&#xe62d;</i>收藏</div>
                <div><i className="iconfont">&#xe606;</i>更多</div>
            </Menu>
        )
    }
    // 歌曲列表
    const renderSongList = () => {
        return (
            <SongList>
                <div className="first_line">
                    <div className="play_all">
                        <i className="iconfont">&#xe6e3;</i>
                        <span>播放全部<span className="sun">(共{currentAlbum.tracks.length}首)</span></span>
                    </div>
                    <div className="add_list">
                        <i className="iconfont">&#xe62d;</i>
                        <span>收藏{getCount(currentAlbum.subscribedCount)}}</span>
                    </div>
                </div>
                <SongItem>
                    {
                        currentAlbum.tracks.map((item, index) => {
                            return (
                                <li key={index}>
                                    <span className="index">{index + 1}</span>
                                    <div className="info">
                                        <span>{item.name}</span>
                                        <span>
                                            {getName(item.ar)} - {item.al.name}
                                        </span>
                                    </div>
                                </li>
                            )
                        })
                    }
                </SongItem>
            </SongList>
        )
    }
    return (
        <CSSTransition
            in={showStatus}
            timeout={300}
            classNames='fly'
            appear={true}
            unmountOnExit
            onExited={props.history.goBack}>
            <Container>
                <Header title={title} handleClick={handleBack} ref={headerEl} isMarquee={isMarquee}></Header>
                <Scroll bounceTop={false} onScroll={handleScroll}>
                    <div>
                        {renderTopDesc()}
                        {renderMenu()}
                        {renderSongList()}
                    </div>
                </Scroll>
            </Container>
        </CSSTransition>
    )
}

export default React.memo(Album);