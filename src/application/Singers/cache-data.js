// - 上文中还有一个小小的问题：当我们在`Singers`页面中选好`category`和`alpha`的时候，如果在切换组件回来的时候，`category`和`alpha`数据就会丢失。但是我们想要缓存`category`和`alpha`的数据的时候，怎么办呢？
// - 进行组件切换前可以保存当前组件的状态，组件切换之后，当前组件即将被卸载，对于组件内部有关的函数引用也会消失，作用域引用也会消失，闭包变量也将不复存在。
// - 但是如果我们想要缓存组件内部的数据，那么可以采用Hooks版本的redux来模拟全局的状态管理Redux
// - Hooks的`useContext`和`useReducer`结合打造出Redux的状态管理器

import React, { createContext, useReducer } from "react";
import { fromJS } from "immutable";

// context提供上下文组件
export const CategoryDataContext = createContext({});

//constants常量
export const CHANGE_CATEGORY = "singers/CHANGE_CATEGORY";
export const CHANGE_ALPHA = "singers/CHANGE_ALPHA";

// reducer函数
const reducer = (state, action) => {
  switch (action.type) {
      case CHANGE_CATEGORY:
          return state.set("category", action.data);
      case CHANGE_ALPHA:
          return state.set("alpha", action.data);
      default:
          return state;
  }
}

//Provider组件(提供数据和方法)
export const Data = props => {
  // useReducer的第二个参数传入初始值
  const [data, dispatch] = useReducer(reducer, fromJS({
      category: "",
      alpha: "",
  }));
  return (
      <CategoryDataContext.Provider value={{ data, dispatch }}>
          {props.children}
      </CategoryDataContext.Provider>
  )
}