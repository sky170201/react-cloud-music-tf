// ### 7.2 loading效果
// -  `ajax`请求数据的时候需要一定的时间，在此期间页面是空白状态，会让人产生焦急的感觉，这对用户来说是个不好的开发体验
// -  所以需要`loading`动画来缓解这种焦急的情绪
// - 主要是用CSS3的`animation-delay`

import React from "react";
import styled, { keyframes } from "styled-components";
import style from "assets/global-style";
import PropTypes from "prop-types";

const loading = keyframes`
    0%,100%{
        transform:scale(0.0);
    }
    50%{
        transform:scale(1.0);
    }
`;
const LoadingWrapper = styled.div`
    >div{
        position:fixed;
        z-index:1000;
        left:0;
        right:0;
        top:0;
        bottom:0;
        margin:auto;
        width:60px;
        height:60px;
        opacity:0.6;
        border-radius:50%;
        background-color:${style["theme-color"]};
        animation:${loading} 1.4s infinite ease-in;
    }
    >div:nth-child(2){
        animation-delay:-0.7s
    }

`;

function Loading(props) {
    const { show } = props;
    return(
    <LoadingWrapper style={show ? {display: ''} : {display: 'none'}}>
      <div></div>
      <div></div>
    </LoadingWrapper>
  )
}

Loading.defaultProps = {
    show: true,
}
Loading.propTypes = {
    show: PropTypes.bool,
}
export default React.memo(Loading);