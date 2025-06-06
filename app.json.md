# app.json 配置说明

这个文件是微信小程序的全局配置文件，以下是各配置项的说明：

```json
{
  "pages": [
    "pages/index/index"  // 定义小程序的页面路径，这里只有一个首页
  ],
  "window": {  // 定义小程序所有页面的默认窗口样式
    "backgroundTextStyle": "light",  // 下拉刷新时loading的样式，可选值为light或dark
    "navigationBarBackgroundColor": "#3cc51f",  // 导航栏背景颜色，这里是绿色
    "navigationBarTitleText": "ITC吃什么",  // 导航栏标题文字内容
    "navigationBarTextStyle": "white"  // 导航栏标题颜色，可选值为black或white
  },
  "style": "v2",  // 指定使用新版的组件样式
  "sitemapLocation": "sitemap.json"  // 指定sitemap.json的位置，用于配置小程序及其页面是否允许被微信索引
}
```

## 配置项详细说明

### pages
定义小程序的页面路径，数组的第一项代表小程序的初始页面（首页）。小程序中新增/减少页面，都需要对 pages 数组进行修改。

### window
用于设置小程序的状态栏、导航条、标题、窗口背景色等。

- **backgroundTextStyle**: 下拉刷新时loading的样式，可选值为light或dark
- **navigationBarBackgroundColor**: 导航栏背景颜色
- **navigationBarTitleText**: 导航栏标题文字内容
- **navigationBarTextStyle**: 导航栏标题颜色，可选值为black或white

### style
指定使用新版的组件样式，v2表示使用新版样式。

### sitemapLocation
指定sitemap.json的位置，用于配置小程序及其页面是否允许被微信索引。