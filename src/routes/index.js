import React from 'react';
import { Redirect } from 'react-router-dom'; // 路由组件
import Home from '../application/Home'; // 首页
import Recommend from '../application/Recommend'; // 推荐
import Singers from '../application/Singers'; // 歌手
import Rank from '../application/Rank'; // 排行榜

export default [
  {
    path: '/',
    component: Home,
    routes: [ // 根据路径的不同显示出不同的功能组件
      {
        path: '/',
        exact: true,
        render: () => ( // 重定向Recommend组件
          <Redirect to={"/recommend"} />
        )
      },
      {
        path: '/recommend',
        component: Recommend // 推荐
      },
      {
          path: "/singers",
          component: Singers //歌手
      },
      {
          path: "/rank",
          component: Rank //排行榜
      }
    ]
  }
]