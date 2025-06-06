# 食物图标说明

请在此目录中添加以下食物图标文件，这些图标在全局数据中被引用：

1. `jiangzhe.png` - 江浙菜图标
2. `japanese.png` - 日式料理图标
3. `hotpot.png` - 火锅图标
4. `western.png` - 西餐图标
5. `canton.png` - 粤菜图标
6. `korean.png` - 韩式料理图标
7. `sichuan.png` - 川菜图标
8. `northeast.png` - 东北菜图标
9. `xinjiang.png` - 新疆菜图标
10. `fastfood.png` - 快餐图标
11. `snack.png` - 小吃图标
12. `vegetarian.png` - 素食图标

这些图标在 app.js 的 globalData 中被引用：

```javascript
globalData: {
  foodTypes: [
    { name: '江浙菜', icon: '/images/food/jiangzhe.png' },
    { name: '日式料理', icon: '/images/food/japanese.png' },
    { name: '火锅', icon: '/images/food/hotpot.png' },
    { name: '西餐', icon: '/images/food/western.png' },
    { name: '粤菜', icon: '/images/food/canton.png' },
    { name: '韩式料理', icon: '/images/food/korean.png' },
    { name: '川菜', icon: '/images/food/sichuan.png' },
    { name: '东北菜', icon: '/images/food/northeast.png' },
    { name: '新疆菜', icon: '/images/food/xinjiang.png' },
    { name: '快餐', icon: '/images/food/fastfood.png' },
    { name: '小吃', icon: '/images/food/snack.png' },
    { name: '素食', icon: '/images/food/vegetarian.png' }
  ]
}
```

请确保添加的图标文件名称与代码中引用的名称一致，或者修改代码以匹配您的图标文件名称。

建议使用尺寸一致的PNG格式图标，推荐尺寸为128x128像素或64x64像素，以确保在小程序界面上显示效果良好。