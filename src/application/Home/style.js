import styled from 'styled-components';
import style from '../../assets/global-style';

// 顶部状态栏样式
export const Top = styled.div`
  display:flex;
    flex-direction:row;//主轴方向，从左到右排列
    justify-content:space-between;//项目在主轴上的对其方式和空间的分配
    padding: 5px 10px ;
    background:${style["theme-color"]};
    &>span{
        line-height:40px;
        color:#f1f1f1;
        font-size:20px;
        &.iconfont{
          font-size:25px;
      }
  }
`

//Tab标签栏样式
export const Tab = styled.div`
    height:44px;
    display:flex;
    flex-direction:row;
    justify-content:space-around;
    background:${style["theme-color"]};
    a{
        flex:1;
        padding:2px 0;
        font-size:14px;
        color:#e4e4e4;
        &.selected{
            span{
                padding:3px 0;
                font-weight:700;
                color:#f1f1f1;
                border-bottom:2px solid #f1f1f1;
            }
        }
    }
`;

//TabItem 标签栏项目的样式
export const TabItem = styled.div`
    height:100%;
    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;//项目在交叉轴上对齐方式
`