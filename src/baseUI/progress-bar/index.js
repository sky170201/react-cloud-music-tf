import React,{useState,useRef, useEffect} from 'react';
import styled from "styled-components";
import style from "assets/global-style";

// - `ProgressBarRef`需要的是监听`percent(百分比)`的数据变化，用来控制进度条的显示长度
// - 另一个是监听进度条的改变事件`(onProgressChange)`，进度条滑动或者点击的时候用来改变`percent`的回调函数
// - 拖动结束的时候改变百分比,并传给上层组件
// - 监听`percent`变化,`percent`变化后进度条更新

const ProgressBarWrapper = styled.div`
    height: 30px;
    .bar-inner{
        position: relative;
        top: 13px;
        height: 4px;
        background: rgba(0,0,0,0.3);
        .progress{
            position: absolute;
            height: 100%;
            background: ${style["theme-color"]};
        }
        .progress-btn-wrapper{
            position: absolute;
            left: -8px;
            top: -13px;
            width: 30px;
            height: 30px;
            .progress-btn{
                position: relative;
                top: 7px;
                left: 7px;
                box-sizing: border-box;
                width: 16px;
                height: 16px;
                border: 3px solid ${style["border-color"]};
                border-radius: 50%;
                background:${style["theme-color"]};
            }
        }
    }
`;

function ProgressBar(props) {
          const { percent, percentChange } = props;
          const [touch, setTouch] = useState({})
          const progressBarRef = useRef();
          const progressRef = useRef();
          const progressBtnRef = useRef();
          const progressBtnWidth = 16;
      
          //改变百分比
          const _changePercent = () => {
              const barWidth = progressBarRef.current.clientWidth - progressBtnWidth;
              const curPercent = progressRef.current.clientWidth / barWidth;//当前进度条的百分比
              percentChange(curPercent) //从父组件接收过来的方法，会在后续介绍
          }
      
          //进度条样式的移动，无论是拖动还是点击
          const _offset = (offsetWidth) => {
              progressRef.current.style.width = `${offsetWidth}px`;
              progressBtnRef.current.style.transform = `translate3d(${offsetWidth}px,0,0)`;
          }
          //拖动前开始
          const progressTouchStart = (e) => {
              const startTouch = {};
              startTouch.initiated = true;//表示可以进行滑动
              startTouch.startX = e.touches[0].pageX;//滑动开始前的横向坐标
              startTouch.left = progressRef.current.clientWidth;//此时progress的长度
              setTouch(startTouch);
          }
          //移动中
          const progressTouchMove = (e) => {
              if (!touch.initiated) return;
              // 滑动距离的相关数据
              const deltaX = e.touches[0].pageX - touch.startX;
              const barWidth = progressBarRef.current.clientWidth - progressBtnWidth;
              const offsetWidth = Math.min(Math.max(0, touch.left  +  deltaX), barWidth);
              _offset(offsetWidth);
          }
          //拖动结束
          const progressTouchEnd = (e) => {
              const endTouch = JSON.parse(JSON.stringify(touch));
              endTouch.initiated = false;
              setTouch(endTouch);
              _changePercent();
          }
          // 点击时进度条的改变
          const progressClick = (e) => {
            //用于获取某个元素相对于视窗的位置集合
              const rect = progressBarRef.current.getBoundingClientRect();
              const offsetWidth = e.pageX - rect.left;
              _offset(offsetWidth);
              _changePercent()
          }
        // 监听percent变化
        useEffect(() => {
        if (percent >= 0 && percent <= 1 && !touch.initiated) {
                const barWidth = progressBarRef.current.clientWidth - progressBtnWidth;
                const offsetWidth = percent * barWidth;
                progressRef.current.style.width = `${offsetWidth}px`;
                progressBtnRef.current.style.transform = `translate3d(${offsetWidth}px,0,0)`;
            }
        }, [percent, touch.initiated])
        return (
            <ProgressBarWrapper>
                 <div className="bar-inner" ref={progressBarRef} onClick={progressClick}>
                     <div className="progress" ref={progressRef}></div>
                    <div className="progress-btn-wrapper" 
                         ref={progressBtnRef}
                         onTouchStart={progressTouchStart}
                         onTouchMove={progressTouchMove}
                         onTouchEnd={progressTouchEnd}
                    >
                        <div className="progress-btn"></div>
                    </div>
                </div>
            </ProgressBarWrapper>
        )
    };

export default React.memo(ProgressBar);