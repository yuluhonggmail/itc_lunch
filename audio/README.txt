# 音频文件说明

请在此目录中添加以下音频文件：

1. `spin.mp3` - 老虎机旋转时的音效
2. `win.mp3` - 老虎机停止并显示结果时的音效

这些音频文件在小程序的 index.js 中被引用：

```javascript
// 旋转音效
const spinAudio = wx.createInnerAudioContext();
spinAudio.src = '/audio/spin.mp3';
spinAudio.play();

// 结果音效
const endAudio = wx.createInnerAudioContext();
endAudio.src = '/audio/win.mp3';
endAudio.play();
```

请确保添加的音频文件名称与代码中引用的名称一致，或者修改代码以匹配您的音频文件名称。