import React, { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import styled from 'styled-components';
import { prefixStyle } from 'utils';
import style from 'assets/global-style';

const Container = styled.div`
  .icon_wrapper{
    position: fixed;
    z-index: 1000;
    margin-top: -10px;
    margin-left: -10px;
    color: ${style["theme-color"]};
    font-size: 14px;
    display: none;
    transition: transform 1s cubic-bezier(.62,-0.1,.86,.57);
    transform: translate3d(0, 0, 0);
    >div{
      transition: transform 1s;
    }
  }
`;

const MusicNote = forwardRef((props, ref) => {
  const iconsRef = useRef();
  const ICON_NUMBER = 3; // 同时有3个音符下落
  const transform = prefixStyle('transform');

  // 原生DOM操作
  const createNode = (txt) => {
    const template = `<div class="icon_wrapper">${txt}</div>`;
    let templateNode = document.createElement('div');
    templateNode.innerHTML = template;
    return templateNode.firstChild;
  }

  useEffect(() => {
    for (let i = 0; i < ICON_NUMBER; i++) {
      let node = createNode(`<div class="iconfont">&#xe642;</div>`);
      iconsRef.current.appendChild(node);
    }

    // 类数组转换数组
    let domArray = Array.from(iconsRef.current.children);
    domArray.forEach(item => {
      item.running = false;
      item.addEventListener("transitionend", 
        function () {
          this.style['display'] = 'none';
          this.style[transform] = 'translate3d(0,0,0)';
          this.running = false;
          let icon = this.querySelector('div');
          icon.style[transform] = 'translate3d(0,0,0)';
      }, false);
    })
  }, [transform])

  // 下落icon的动画效果
  const startAnimation = ({ x, y }) => {
    for (let i = 0; i < ICON_NUMBER; i++) {
        let domArray = [].slice.call(iconsRef.current.children)
        let item = domArray[i]
        // 选择一个空闲的元素来开始动画
        if (item.running === false) {
            item.style.left = x + "px";
            item.style.top = y + "px";
            item.style.display = "inline-block";
            setTimeout(() => {
                item.running = true;
                item.style[transform] = `translate3d(0, 750px, 0)`;
                let icon = item.querySelector("div");
                icon.style[transform] = `translate3d(-40px, 0, 0)`;
            }, 20);
            break;
          }
      }
  };

  //外界调用的ref方法
  useImperativeHandle(ref, () => ({
      startAnimation
  }));
  return (
      <Container ref={iconsRef}></Container>
  )
})

export default React.memo(MusicNote)