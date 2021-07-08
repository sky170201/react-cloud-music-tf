import React, { useRef, useEffect } from 'react';
import styled from "styled-components";
import Scroll from "../scroll/index";
import PropTypes from "prop-types";
import style from "../../assets/global-style";

//列表的样式
const List = styled.div`
    display:flex;
    align-items:center;
    height:30px;
    overflow:hidden;
    >span:first-of-type{
        display:block;
        flex:0 0 auto;
        padding:5px 0;
        margin-right:5px;
        color:grey;
        font-size:${style["font-size-m"]};
        vertical-align:middle;
    }
`;

//每一个列表项目的样式
const ListItem = styled.span`
    flex:0 0 auto;
    font-size:${style["font-size-m"]};
    padding:5px 8px;
    border-radius:10px;
    &.selected{
        color:${style["theme-color"]};
        border:1px solid ${style["theme-color"]};
        opacity:0.8;
    }
`;

function LevelItem(props) {
  const { list, oldVal, title } = props;
  const { handleClick } = props;
  const CategoryRef = useRef(null);
  // 根据内容设置容器的宽度
  useEffect(() => {
    let categoryDOM = CategoryRef.current;//获取其dom元素
    let spans = categoryDOM.querySelectorAll("span");//获取到span所有的标签
    let totalWidth = 0;
    Array.from(spans).forEach(ele => {
      totalWidth += ele.offsetWidth;
    })
    categoryDOM.style.width = `${totalWidth}px`;//获取到内容宽度
  }, [])
  return (
    <Scroll direction={"horizontal"}>
        {/* <div> */}
            <List ref={CategoryRef}>
                <span>{title}</span>
                {
                    list.map(item => {
                        return (
                            <ListItem key={item.key} className={`${oldVal === item.key ? "selected" : ""}`} onClick={() => handleClick(item.key)}>
                                {item.name}
                            </ListItem>
                        )
                    })
                }
            </List>
        {/* </div> */}
    </Scroll >
  )
}

LevelItem.defaultProps = {
  list: [],    //接收到的列表数据
  oldVal: "",  //当前的item值
  title: "",  //列表左边的标题
  handleClick: null,///点击不同的item执行的方法
}

LevelItem.propTypes = {
  list: PropTypes.array,
  oldVal: PropTypes.string,
  title: PropTypes.string,
  handleClick: PropTypes.func,
}

export default React.memo(LevelItem);