import React, { useEffect } from "react";
import { List, ListItem, SongList, Container, EnterLoading } from "./style";
import { connect } from "react-redux";
import { getRankList } from "./store";
import Loading from "baseUI/loading/index";
import Scroll from "baseUI/scroll/index";
import { filterIdx, filterIndex } from "utils";
import { renderRoutes } from "react-router-config";

function Rank(props) {
    const { rankList: list, loading } = props;
    const { getRankListDispatch } = props;
    const rankList = list ? list.toJS() : [];

    useEffect(() => {
        if (!rankList.length) {//性能优化，避免多次调用
            getRankListDispatch()
        }
    },[]);
    let globalStartIndex = filterIndex(rankList);//根据tracks进行区分
    let officialList = rankList.slice(0, globalStartIndex);//前半段的数据数据官方榜
    let globalList = rankList.slice(globalStartIndex);//后半段的数据属于全球榜

    //查找是否有对应的编号
    let enterDetail = (name) => {
        const idx = filterIdx(name);
        if (idx === null) {
            alert("暂无相关的数据");
            return;
        }
    }

    // 渲染歌曲列表
    const renderSongList = (list) => {
        return list.length ? (
            <SongList>
                {
                    list.map((item, index) => {
                        return <li key={index + 1}>{index + 1}·{item.first}-{item.second}</li>
                    })
                }
            </SongList>
        ) : null
    }

    // 渲染排行榜列表，根据第二个参数的判断来确认是全球榜
    const renderRankList = (list, global) => {
        return (
            // 确定是全球榜 global为true，其样式会有所改变
            <List globalRank={global}>
                {
                    list.map(item => {
                        return (
                            <ListItem key={item.coverImgId} tracks={item.tracks} onClick={() => enterDetail(item.name)}>
                                <div className="img_wrapper">
                                    <img src={item.coverImgUrl} alt="rank-image" />
                                    <div className="decorate"></div>
                                    <span className="update_frequency">{item.updateFrequency}</span>
                                </div>
                                {renderSongList(item.tracks)}
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    }
    const displayStyle = loading ? { "display": "none" } : { "display": "" }
    return (
        <Container>
            <Scroll>
                <div>
                    <h1 className="official" style={displayStyle}>官方榜</h1>
                    {renderRankList(officialList)}
                    <h1 className="global" style={displayStyle}>全球榜</h1>
                    {renderRankList(globalList, true)}
                    {loading ? <EnterLoading><Loading></Loading></EnterLoading> : null}
                </div>
            </Scroll>
            {renderRoutes(props.route.routes)}
        </Container>
    )
}

// 映射Redux全局的state到组件的props
const mapStateToProps = (state) => ({
    rankList: state.getIn(['rank', 'rankList']),
    loading: state.getIn(['rank', 'loading'])
})

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
    return {
        getRankListDispatch() {
            dispatch(getRankList())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Rank));