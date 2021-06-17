import styled from 'styled-components';
import style from 'assets/global-style';

export const SliderContainer = styled.div`
  position:relative;
    box-sizing:border-box;
    width:100%;
    margin:auto;
    .before{
        position:absolute;
        top:-300px;  // 处理下拉空白存在的问题
        height:400px; // 处理下拉空白存在的问题
        width:100%;
        background:${style["theme-color"]};
    }
    .slider-container{
        position:relative;
        width:98%;
        height:160px;
        overflow:hidden;
        margin:auto;
        border-radius:6px;
        .slider-nav{
            position:absolute;
            display:block;
            width:100%;
            height:100%;
        }
        .swiper-pagination-bullet-active{
            background:${style["theme-color"]}
        }
    }
`;