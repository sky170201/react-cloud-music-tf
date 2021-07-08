import React, { useEffect } from "react";

import Slider from 'components/slider';
import RecommendList from 'components/list';
import Scroll from 'baseUI/scroll'; // 滑动效果
import { Content } from './style';
import { connect } from 'react-redux';
import * as actionCreators from './store/actionCreators'; // 所有的派发方法
import { forceCheck } from "react-lazyload"; // 引入
import Loading from "baseUI/loading/index";
import { renderRoutes } from "react-router-config";

function Recommend(props) {
    console.log(props, 123)
    const { songCount } = props;
    const { bannerList, recommendList, enterLoading } = props; // 参数
    useEffect(() => {
        const { getBannerList, getRecommendList } = props;
//         redux 数据缓存
// - 此时先从推荐页面切换到歌手页面，在切换回来的话，通过`network`看到网络请求两次，这是属于性能浪费
// - 所以我们利用redux的数据进行页面缓存来达到性能优化,第一次请求接口,有数据后就不请求了
        if(bannerList.size===0) getBannerList();
        if(recommendList.size===0) getRecommendList();
    }, [bannerList.size, props, recommendList.size])
    const bannerListJS = bannerList ? bannerList.toJS() : [];
    const recommendListJS = recommendList ? recommendList.toJS() : [];
    return (
        <Content play={songCount}>
            <Scroll className="list" onScroll={forceCheck}>
                <div> {/*这个div必须保留，否则Scroll组件无法工作*/}
                    <Slider bannerList={bannerListJS}></Slider>
                    <RecommendList recommendList={recommendListJS}></RecommendList>
                </div>
            </Scroll>
            {enterLoading && <Loading></Loading>}
            {renderRoutes(props.route.routes)}
        </Content>
    )
}

// 映射Redux 全局的state到组件的props
const mapStateToProps = (state) => ({
    // 获取相应的数据
    bannerList: state.getIn(["recommend", "bannerList"]),
    recommendList: state.getIn(["recommend", "recommendList"]),
    enterLoading: state.getIn(["recommend", "enterLoading"]),
    songCount: state.getIn(['player', 'playList']).size
})

// 将ui组件包装成容器组件
export default connect(mapStateToProps, actionCreators)(React.memo(Recommend))