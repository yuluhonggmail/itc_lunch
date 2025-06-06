// app.js - 这是小程序的全局入口文件，定义了整个应用程序的基本配置和全局数据

App({
  // globalData: 全局数据对象，可以在小程序的任何页面中访问这些数据
  globalData: {
    // foodTypes: 定义了所有可选的美食类型及其对应的图标路径
    // 这个数组包含了多种美食类型，每种类型都有名称和对应的图标
    foodTypes: [
      { name: '江浙菜', icon: '/images/food/jiangzhe.png' }, // 江浙菜及其图标路径
      { name: '日式料理', icon: '/images/food/japanese.png' }, // 日式料理及其图标路径
      { name: '火锅', icon: '/images/food/hotpot.png' }, // 火锅及其图标路径
      { name: '西餐', icon: '/images/food/western.png' }, // 西餐及其图标路径
      { name: '粤菜', icon: '/images/food/canton.png' }, // 粤菜及其图标路径
      { name: '韩式料理', icon: '/images/food/korean.png' }, // 韩式料理及其图标路径
      { name: '川菜', icon: '/images/food/sichuan.png' }, // 川菜及其图标路径
      { name: '东北菜', icon: '/images/food/northeast.png' }, // 东北菜及其图标路径
      { name: '新疆菜', icon: '/images/food/xinjiang.png' }, // 新疆菜及其图标路径
      { name: '快餐', icon: '/images/food/fastfood.png' }, // 快餐及其图标路径
      { name: '小吃', icon: '/images/food/snack.png' }, // 小吃及其图标路径
      { name: '素食', icon: '/images/food/vegetarian.png' } // 素食及其图标路径
    ]
  },
  
  // onLaunch: 小程序启动时执行的函数，这是小程序的生命周期函数之一
  onLaunch() {
    // 这里是小程序初始化时要执行的代码
    console.log('App launched'); // 在控制台输出"App launched"，表示应用已启动
  }
});