import React from 'react';
import { IconStyle } from './assets/iconfont/iconfont';
import { GlobalStyle } from './style';
import routes from './routes/index'; // 路由文件配置的所有路由
import { HashRouter } from 'react-router-dom'; // hash路由
import { renderRoutes } from 'react-router-config'; // 读取路由配置并转化Route标签，但是只能渲染第一层路由
import store from './store/index';
import { Provider } from 'react-redux'; // 所以容器的能够访问到store
import { Data } from './application/Singers/cache-data';


function App() {
  return (
    // <div className="App">
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle></GlobalStyle>
        <IconStyle></IconStyle>
        <Data>
          { renderRoutes(routes) }
        </Data>
        {/* <i className="iconfont">&#xe62b;</i> */}
      </HashRouter>
    </Provider>
    // </div>
  );
}

export default App;
