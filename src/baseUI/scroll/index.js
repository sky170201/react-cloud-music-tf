import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState, useMemo } from "react";
import PropTypes from "prop-types";
import BetterScroll from "better-scroll";
import styled from "styled-components";
import Loading from "../loading/index";
import LoadingV2 from "../loading-v2/index";
import {debounce} from 'utils';

//上拉loading
const PullUpLoading = styled.div`
    position:absolute;
    left:0;right:0;
    bottom:5px;
    width:60px;
    height:60px;
    margin:auto;
    z-index:100;
`;
//下拉loading
const PullDownLoading = styled.div`
    position:absolute;
    left:0;right:0;
    top:0;
    height:30px;
    margin:auto;
    z-index:100;
`;

const ScrollContainer = styled.div`
    width:100%;
    height:100%;
    overflow:hidden;
`;
/**
 * forwardRef
 * props:父组件传递的props
 * ref：父组件传递的ref，希望在封装组件时，外层组件通过ref直接控制内存组件或元素的行为
 */
const Scroll = forwardRef((props, ref) => {
  const [bScroll, setBScroll] = useState();
  const scrollContainerRef = useRef(); // 获取scroll实例需要的DOM元素
  const { direction, click, refresh, bounceTop, bounceBottom } = props;
  const { pullUp, pullDown, onScroll } = props;
  const pullUpDebounce = useMemo(() =>  debounce(pullUp, 300), []);
  const pullDownDebounce = useMemo(() => debounce(pullDown, 300), []);
  const {pullUpLoading,pullDownLoading } = props;
  const PullUpDisplayStyle = {display:pullUpLoading?'':'none'};
  const PullDownDisplayStyle ={display:pullDownLoading?'':'none'};
  useEffect(() => {
    const scroll = new BetterScroll(scrollContainerRef.current, {
      scrollX: direction === 'horizontal',
      scrollY: direction === 'vertical',
      probeType: 3,
      click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom
      }
    });
    setBScroll(scroll);
    return () => {
      setBScroll(null)
    }
  }, []);

  // 给实例绑定scroll事件
  useEffect(() => {
    if (!bScroll || !onScroll) return;
    bScroll.on('scroll', (scroll) => {
      onScroll(scroll)
    })
    return () => {
      bScroll.off('scroll')
    }
  }, [onScroll, bScroll]);

  // 进行上拉到头的逻辑判断，调用上拉刷新的函数
  useEffect(() => {
    if (!bScroll || !pullUp) return;
    bScroll.on('scrollEnd', () => {
      // 判断是否滑到了底部
      if (bScroll.y <= bScroll.maxScroll  +  100) {
        pullUpDebounce()
      }
    });
    return () => {
      bScroll.off('scrollEnd')
    }
  }, [pullUp, bScroll])

  // 进行下拉的刷新，调用下拉刷新的函数
  useEffect(() => {
    if (!bScroll || !pullDown) return;
    bScroll.on("touchEnd", (pos) => {
        // 判断用户是否下拉
        if (pos.y > 50) {
          pullDownDebounce()
        }
    });
    return () => {
        bScroll.off("touchEnd")
    }
  }, [pullDown, bScroll])

  // 每次重新渲染都需要刷新实例，防止无法滑动
  useEffect(() => {
    if (refresh && bScroll) {
      bScroll.refresh()
    }
  })

  // useImperativeHandle可以使父子组件分别有自己的ref.current
  // 和forwardRef配合使用，useImperativeHandle可以在使用ref时自定义暴露给父组件的实例值
  useImperativeHandle(ref, () => ({//暴露给外界的方法
    refresh() {
        if (bScroll) {
            bScroll.refresh();
            bScroll.scrollTo(0, 0)
        }
    },
    getBScroll() {
        if (bScroll) {//提供scroll实例
            return bScroll;
        }
      }
  }))
  return (
      <ScrollContainer ref={scrollContainerRef}>
          {props.children}
          {/* 底部上拉刷新动画 */}
          <PullUpLoading style={PullUpDisplayStyle}><Loading/></PullUpLoading>
           {/* 顶部下拉刷新动画 */}
          <PullDownLoading style={PullDownDisplayStyle}><LoadingV2/></PullDownLoading>
      </ScrollContainer>
  )
})

Scroll.defaultProps = {
  direction: "vertical",
  click: true,
  refresh: true,
  onScroll: null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: null,
  pullDown: null,
  bounceTop: true,
  bounceBottom: true,
}

Scroll.propTypes = {
  direction: PropTypes.oneOf(["vertical", "horizontal"]),//滚动方向
  click: PropTypes.bool,//是否支持点击
  refresh: PropTypes.bool,//是否刷新
  onScroll: PropTypes.func,//滑动触发的回调函数
  pullUpLoading: PropTypes.bool,//是否显示上拉loading动画
  pullDownLoading: PropTypes.bool,//是否显示下拉loading动画
  pullUp: PropTypes.func,//上拉加载逻辑
  pullDown: PropTypes.func,//下拉加载逻辑
  bounceTop: PropTypes.bool,//是否支持向上吸顶
  bounceBottom: PropTypes.bool,//是否支持向下吸底
}

export default Scroll;