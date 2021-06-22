import React, { useState, useEffect, useContext } from "react";
import LevelItem from "baseUI/level-item";
import { categoryTypes, alphaTypes } from "api/config";
import { NavContainer, List, ListItem, ListContainer } from "./style";
import Scroll from "baseUI/scroll";
import { getSingerList, getHotSingerList, changeEnterLoading, changePageCount, refreshMoreHotSingerList, refreshMoreSingerList, changePullUpLoading, changePullDownLoading } from "./store/actionCreators";
import { connect } from "react-redux";
import Loading from "baseUI/loading/index";
import LazyLoad, { forceCheck } from "react-lazyload";
import { CHANGE_CATEGORY, CHANGE_ALPHA, CategoryDataContext, Data } from "./cache-data";

function Singers(props) {
    const { singerList, enterLoading, pullUpLoading, pullDownLoading, pageCount } = props;//从仓库中获取数据
    const { getHotSingerDispatch, pullUpRefreshDispatch, pullDownRefreshDispatch } = props;
    const {updateDispatch} = props;//从dispatch中获取方法
    // const [category, setCategory] = useState("");//分类
    // const [alpha, setAlpha] = useState("");//字母
    const { data, dispatch } = useContext(CategoryDataContext);
    // 获取到category和alpha的值
    const { category, alpha } = data.toJS();//immutable对象换成JS对象
    // 处理字母的方法
    let handleUpdateAlpha = (val) => {
        // setAlpha(val);
        dispatch({ type: CHANGE_ALPHA, data: val })
        updateDispatch(category, val)//选择字母后更新数据
    }
    // 处理分类的方法
    let handleUpdateCategory = (val) => {
        // setCategory(val);
        dispatch({ type: CHANGE_CATEGORY, data: val })
        updateDispatch(category, val)//选择分类后更新数据
    }
    //初始化页面--热门歌手渲染页面
    useEffect(() => {
        if (singerList.size===0) getHotSingerDispatch()
    }, [])
    //渲染歌手列表
    const renderSingerList = () => {
        const singerListJS = singerList ? singerList.toJS() : [];
        return (
        <List>
            {
                singerListJS.map((item, index) => {
                    return (
                        <ListItem key={item.accountId + "" + index}>
                            <div className="img_wrapper">
                              <LazyLoad placeholder={<img src="https://markdownit-images.oss-cn-beijing.aliyuncs.com/music/singer.png" width="100%" height="100%" alt="singers-music" />}>
                            <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="singers-music" />
                              </LazyLoad>
                            </div>
                            <span className="name">{item.name}</span>
                        </ListItem>
                    )
                })
            }
        </List>
        )
    }
    //处理上拉事件
    const handlePullUp = () => {
    pullUpRefreshDispatch(category, alpha, category === "", pageCount);
    }
    // 处理下拉事件
    const handlePullDown = () => {
    pullDownRefreshDispatch(category, alpha);
    }
    return (
        <Data>
            <NavContainer>
                <LevelItem
                    list={categoryTypes}
                    title={"分类(默认热门):"}
                    handleClick={val => handleUpdateCategory(val)}
                    oldVal={category}></LevelItem>
                <LevelItem
                    list={alphaTypes}
                    title={"首字母:"}
                    handleClick={val => handleUpdateAlpha(val)}
                    oldVal={alpha}></LevelItem>
                <ListContainer>
                    <Scroll
                    pullUp={handlePullUp}
                    pullDown={handlePullDown}
                    pullUpLoading={pullUpLoading}
                    pullDownLoading={pullDownLoading}
                    onScroll={forceCheck}>
                        {renderSingerList()}
                    </Scroll>
                    <Loading show={enterLoading}></Loading>
                </ListContainer>
            </NavContainer>
        </Data>
    )
}

//映射Redux全局的state到组件的props
const mapStateToProps = (state) => ({
    singerList: state.getIn(["singers", "singerList"]),
    enterLoading: state.getIn(["singers", "enterLoading"]),
    pullUpLoading: state.getIn(["singers", "pullUpLoading"]),
    pullDownLoading: state.getIn(["singers", "pullDownLoading"]),
    pageCount: state.getIn(["singers", "pageCount"]),
})
//映射dispatch 到 props上
const mapDispatchToProps = (dispatch) => {
    return {
        getHotSingerDispatch() {
            dispatch(getHotSingerList())
        },
        updateDispatch(category, alpha) {//更新页面的方法
            dispatch(changePageCount(0));//由于改变分类，pageCount清零
            dispatch(changeEnterLoading(true));
            dispatch(getSingerList(category, alpha));
        },
        // 滑到底部时刷新的部分
        pullUpRefreshDispatch(category, alpha, hot, count) {
            dispatch(changePullUpLoading(true));
            dispatch(changePageCount(count + 1));
            if (hot) {
            dispatch(refreshMoreHotSingerList());//刷新热门歌手
            } else {
            dispatch(refreshMoreSingerList(category, alpha))//刷新分类的列表
            }
        },
        // 顶部下拉的时候刷新
        pullDownRefreshDispatch(category, alpha) {
            dispatch(changePullDownLoading(true));
            dispatch(changePageCount(0));//重新获取数据
            if (category == "" && alpha === "") {
            dispatch(getHotSingerList());
            } else {
            dispatch(getSingerList(category, alpha))
            }
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singers));