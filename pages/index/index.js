// index.js - 这是小程序首页的主要逻辑文件，实现了随机选择美食的功能

// 获取全局应用实例，可以访问全局数据
const app = getApp()

// 定义页面对象
Page({
  // data: 页面的初始数据，这些数据可以在页面中使用
  data: {
    activeIndex: -1,  // 当前激活（高亮显示）的格子索引，初始值为-1表示没有格子被激活
    selectedFood: null,  // 最终选中的食物，初始为null表示未选中任何食物
    isSpinning: false,  // 标记食物选择器是否正在旋转中，用于控制按钮点击状态
    spinCount: 2,  // 剩余的旋转次数，初始值为2次
    
    // 新增：积分系统
    currentScore: 800,  // 当前积分，初始800分
    
    // 新增：倒计时系统
    countdown: '',  // 距离12点的倒计时显示
    
    // 新增：选中的店铺信息
    selectedShop: null,  // 当前选中的店铺信息
    
    // 新增：自定义消息框控制
    showCustomToast: false,  // 是否显示自定义消息框
    toastMessage: '',  // 消息框内容
    
    // 新增：音频系统
    audioContext: null,  // 音频上下文
    lastSoundTime: 0,    // 上次播放音效的时间
    
    // 新增：中奖特效控制
    showJackpotEffect: false,  // 是否显示中奖特效
    
    // 新增：积分增加特效控制
    showScoreEffect: false,  // 是否显示积分增加特效
    scoreEffectText: '',     // 积分增加特效显示的文字
    
    // 新增：喜欢的美食列表，用于存储用户长按后喜欢的美食种类
    favoriteList: [],  // 数组，索引对应美食格子索引，true表示喜欢，false或undefined表示不喜欢
    
    // 新增：专门的提示消息框控制
    showTipMessageBox: false,  // 是否显示专门的提示消息框
    
    // foodCells: 定义转盘上显示的所有食物格子信息 - 按顺时针顺序排列
    foodCells: [
      // 顶部一行：索引 0-5
      { name: '江浙菜', multiplier: '×2', icon: '🦀' },      // 0
      { name: '日式料理', multiplier: '×2', icon: '🍣' },    // 1
      { name: '火锅', multiplier: '×25', icon: '🍲' },       // 2
      { name: '777幸运奖', multiplier: '×50', icon: '🎰' },  // 3 - 原来西餐的位置改为777幸运奖
      { name: '粤菜', multiplier: '×2', icon: '🥮' },        // 4
      { name: '韩式料理', multiplier: '×2', icon: '🥘' },    // 5
      
      // 右侧竖排：索引 6-9
      { name: '湘菜', multiplier: '×2', icon: '🥵' },        // 6
      { name: '烧烤', multiplier: '', icon: '🍗' },          // 7
      { name: '海鲜', multiplier: '', icon: '🦐' },          // 8
      { name: '新疆菜', multiplier: '', icon: '🍖' },        // 9
      
      // 底部一行从右到左：索引 10-15
      { name: '西餐', multiplier: '×2', icon: '🥩' },        // 10 - 原来777幸运奖的位置改为西餐
      { name: '自助餐', multiplier: '', icon: '🍽️' },       // 11
      { name: '麻辣烫', multiplier: '', icon: '🍜' },        // 12
      { name: '素食', multiplier: '', icon: '🥗' },          // 13
      { name: '饮品', multiplier: '×2', icon: '🥤' },        // 14
      { name: '快餐', multiplier: '', icon: '🍔' },          // 15
      
      // 左侧竖排从下到上：索引 16-19
      { name: '东北菜', multiplier: '×2', icon: '🥟' },      // 16
      { name: '面食', multiplier: '×2', icon: '🍝' },        // 17
      { name: '东南亚', multiplier: '×2', icon: '🥥' },      // 18
      { name: '川菜', multiplier: '×2', icon: '🌶️' }        // 19
    ],
    
    // 新增：店铺信息数据库，根据美食种类分类 - 适合午餐的实用餐厅选择
    shopDatabase: {
      '江浙菜': [
        { name: '申宴酒楼(天钥桥店)', distance: '300m', rating: '4.5', price: '¥60/人 (午市套餐)' },
        { name: '外婆家(百联徐汇商业广场店)', distance: '150m', rating: '4.6', price: '¥70/人 (点心套餐)' },
        { name: '苏小柳(ITC One店)', distance: '150m', rating: '4.6', price: '¥70/人 (点心套餐)' },
        { name: '宴福里(文定路店)', distance: '150m', rating: '4.6', price: '¥70/人 (点心套餐)' },
        { name: '晶焱上海菜(徐汇店)', distance: '250m', rating: '4.4', price: '¥80/人 (牛腩面套餐)' },
        { name: '圆苑(徐家汇店)', distance: '250m', rating: '4.4', price: '¥80/人 (牛腩面套餐)' }
      ],
      '日式料理': [
        { name: '阿吾罗·月咏精致日料(港汇恒隆广场店)', distance: '200m', rating: '4.3', price: '¥70/人 (牛肉饭套餐)' },
        { name: '平成屋·午肴夜酒(港汇恒隆广场店)', distance: '100m', rating: '4.4', price: '¥65/人 (鱼饭套餐)' },
        { name: '满来寿喜烧·雅苑(港汇店)', distance: '280m', rating: '4.5', price: '¥50/人 (日替套餐)' },
        { name: '旬福食堂·家庭料理(徐汇店)', distance: '350m', rating: '4.6', price: '¥50/人' },
        { name: '蟹道·东方山海(港汇恒隆广场店)', distance: '350m', rating: '4.6', price: '¥90/人' }
      ],
      '火锅': [
        { name: '湊湊火锅·茶憩(徐汇店)', distance: '350m', rating: '4.4', price: '¥70/人 (单人午市套餐)' },
        { name: '萍姐火锅·公路夜市(徐汇店)', distance: '400m', rating: '4.6', price: '¥90/人 (午市单人套餐)' },
        { name: '怂火锅厂(美罗城店)', distance: '300m', rating: '4.5', price: '¥80/人 (午市单人套餐)' },
        { name: '成都你六姐·牛肉冒菜(南洋1931店)', distance: '300m', rating: '4.5', price: '¥80/人 (午市单人套餐)' }
      ],
      '西餐': [
        { name: 'Wagas (ITC店)', distance: '120m', rating: '4.5', price: '¥70/人 (沙拉/意面午市套餐)' },
        { name: '萨莉亚(百联店)', distance: '400m', rating: '4.3', price: '¥50/人 (意面/焗饭套餐)' },
        { name: 'CRAZYONES西班牙海鲜饭(上海美罗城店)', distance: '300m', rating: '4.4', price: '¥60/人' },
        { name: '斯比特花园西餐厅(东方商厦店)', distance: '300m', rating: '4.4', price: '¥60/人' },
        { name: '新贝乐意大利餐厅(美罗城店)', distance: '300m', rating: '4.4', price: '¥60/人' }
      ],
      '粤菜': [
        { name: '潮州府·潮菜·砂锅粥(徐家汇店)', distance: '150m', rating: '4.5', price: '¥90/人 (午市点心套餐/烧腊饭)' },
        { name: '翠富楼·粤式点心·啫啫煲(美罗城店)', distance: '300m', rating: '4.4', price: '¥85/人 (烧味饭/粉面套餐)' },
        { name: '香江姳苑(广元西路店)', distance: '250m', rating: '4.3', price: '¥70/人 (烧腊饭套餐)' }
      ],
      '韩式料理': [
        { name: '清晨家·首尔烤肉(One ITC店)', distance: '100m', rating: '4.5', price: '¥80/人 (鱼饼汤饭套餐)' },
        { name: '全州印象(百脑汇店)', distance: '300m', rating: '4.4', price: '¥75/人 (石锅拌饭/汤饭套餐)' },
        { name: '安又胖韩国烤肉', distance: '400m', rating: '4.4', price: '¥75/人 (石锅拌饭/汤饭套餐)' }
      ],
      '川菜': [
        { name: '孔雀川菜(港汇恒隆广场店)', distance: '400m', rating: '4.5', price: '¥90/人 (午市套餐)' },
        { name: '成都鬼瘾食(美罗城店)', distance: '350m', rating: '4.4', price: '¥80/人 (川味小炒午市套餐)' },
        { name: '精悦蓉(徐汇美罗城店)', distance: '280m', rating: '4.3', price: '¥70/人 (家常川菜午市套餐)' }
      ],
      '湘菜': [
        { name: '费大厨辣椒炒肉(美罗城店)', distance: '160m', rating: '4.8', price: '¥100/人 (菜品搭配米饭)' },
        { name: '粮仓饭湘(凯旋路店)', distance: '350m', rating: '4.6', price: '¥90/人 (小炒黄牛肉饭)' },
        { name: '古意(国贸汇店)', distance: '350m', rating: '4.6', price: '¥90/人 (小炒黄牛肉饭)' },
        { name: '胡子大厨(百联店)', distance: '100m', rating: '4.6', price: '¥50/人 (面类套餐)' },
        { name: '湘辣辣小炒黄牛肉(美罗城店)', distance: '300m', rating: '4.4', price: '¥85/人 (湘菜小碗菜套餐)' }
      ],
      '东南亚': [
        { name: '西贡妈妈SaigonMama•越南粉(港汇恒隆店)', distance: '120m', rating: '4.7', price: '¥90/人 (越南粉/饭类套餐)' },
        { name: 'The Market Lane(港汇恒隆店)', distance: '250m', rating: '4.5', price: '¥70/人 (鸡饭套餐)' },
        { name: '小泰保(美罗城店)', distance: '350m', rating: '4.4', price: '¥85/人 (泰式咖喱饭套餐)' }
      ],
      '烧烤': [
        { name: 'Grand Yaki厚贞日式烤肉(港汇恒隆店) ', distance: '400m', rating: '4.5', price: '¥100/人 (午市套餐)' },
        { name: '小杨生煎(天钥桥店)', distance: '200m', rating: '4.4', price: '¥35/人 (生煎+汤/粉丝套餐，快餐式烧烤)' },
        { name: '破店肥哈(天钥桥店)', distance: '300m', rating: '4.3', price: '¥60/人 (烤肉饭便当)' }
      ],
      '面食': [
        { name: '陳香貴·蘭州牛肉面(美罗城店)', distance: '100m', rating: '4.6', price: '¥40/人 (面类套餐)' },
        { name: '松鹤楼面馆(港汇店)', distance: '100m', rating: '4.6', price: '¥50/人 (面类套餐)' },
        { name: 'IPPUDO·一风堂(港汇恒隆店)', distance: '100m', rating: '4.6', price: '¥50/人 (面类套餐)' },
        { name: '福和面馆(美罗城店)', distance: '180m', rating: '4.3', price: '¥45/人 (各类午市套餐)' },
        { name: '琥家(港汇恒隆店)', distance: '150m', rating: '4.5', price: '¥70/人 (拉面套餐)' },
        { name: '马记永(广元西路店)', distance: '300m', rating: '4.7', price: '¥50/人 (各式面点套餐)' }
      ],
      '海鲜': [
        { name: '留柱小馆·三兄弟象山海鲜', distance: '850m', rating: '4.5', price: '¥95/人 (烤鱼单人/双人午市套餐)' },
        { name: '胖哥俩蟹肉煲(百联店)', distance: '380m', rating: '4.3', price: '¥80/人 (海鲜饭/面类)' },
        { name: '小隆台·台州菜', distance: '300m', rating: '4.2', price: '¥70/人 (海鲜炒饭/面)' }
      ],
      '777幸运奖': [
        { name: '申立春·泉州牛肉馆', distance: '888m', rating: '4.9', price: '38' },
        { name: '云海肴·汽锅鸡·云南代表菜(美罗城店)', distance: '777m', rating: '5.0', price: '5折!' },
        { name: '荣先森·福建小馆(美罗城店)', distance: '666m', rating: '4.8', price: '买一送一!' },
        { name: '滕记星发餐室·新加坡菜(徐家汇店)', distance: '888m', rating: '4.9', price: '38' }
      ],
      '自助餐': [
        { name: '上海西藏大厦万怡自助餐厅(徐汇店)', distance: '350m', rating: '4.4', price: '¥80/人 (午市自助)' },
        { name: '斗牛士牛排餐厅(TPY中心店)', distance: '400m', rating: '4.3', price: '¥98/人 (牛排套餐)' },
        { name: '牛New寿喜烧(百联店)', distance: '300m', rating: '4.5', price: '¥90/人 (烤肉午市套餐)' }
      ],
      '麻辣烫': [
        { name: '红唇串串香 RedLips', distance: '100m', rating: '4.5', price: '¥40/人' },
        { name: '西塔老太太拌饭(南洋1931店)', distance: '280m', rating: '4.3', price: '¥35/人' },
        { name: '牛腩之旅(南洋1931店)', distance: '320m', rating: '4.4', price: '¥38/人' }
      ],
      '素食': [
        { name: '功德林(天钥桥店)', distance: '350m', rating: '4.6', price: '¥80/人 (素食)' },
        { name: 'EGG BOMB(TPY中心店)', distance: '120m', rating: '4.7', price: '¥100/人 (简餐)' },
        { name: 'Shake Shack(港汇恒隆店)', distance: '400m', rating: '4.5', price: '¥70/人' }
      ],
      '饮品': [
        { name: 'Manner Coffee(港汇恒隆店)', distance: '50m', rating: '4.7', price: '¥25/人 (精品咖啡)' },
        { name: '星巴克臻选((港汇恒隆店))', distance: '250m', rating: '4.6', price: '¥45/人 (特调饮品)' },
        { name: 'M Stand(美罗城店)', distance: '180m', rating: '4.3', price: '¥35/人 (手冲咖啡)' },
        { name: '喜茶(徐家汇店)', distance: '200m', rating: '4.5', price: '¥30/人 (新式茶饮)' },
        { name: 'CoCo都可', distance: '120m', rating: '4.4', price: '¥20/人 (奶茶饮品)' }
      ],
      '快餐': [
        { name: '大米先生(广元西路店)', distance: '100m', rating: '4.6', price: '¥40/人 (自选套餐)' },
        { name: '麦当劳(百联店)', distance: '180m', rating: '4.3', price: '¥45/人 (午市套餐)' },
        { name: '汉堡王(TPY中心店)', distance: '220m', rating: '4.4', price: '¥48/人 (午市套餐)' }
      ],
      '新疆菜': [
        { name: '耶里夏丽新疆餐厅(天钥桥店)', distance: '180m', rating: '4.7', price: '¥95/人 (拌面/手抓饭套餐)' },
        { name: '芭蕉扇·新疆菜(徐家汇店)', distance: '500m', rating: '4.6', price: '¥90/人 (新疆风味午市套餐)' },
        { name: '宁夏印象·盐池滩羊(徐家汇店)', distance: '350m', rating: '4.4', price: '¥70/人 (拉条子/炒面片)' }
      ],
      '东北菜': [
        { name: '喜家德虾仁水饺(美罗城店)', distance: '150m', rating: '4.6', price: '¥45/人 (水饺套餐)' },
        { name: '米村拌饭(TPY中心店)', distance: '400m', rating: '4.5', price: '¥80/人 (东北菜盖饭/小份菜套餐)' },
        { name: '冰城老于家(宛平南路店)', distance: '300m', rating: '4.4', price: '¥90/人 (单人份小锅或盖饭)' }
      ]
    }
  },

  // onLoad: 页面加载时执行的函数，这是页面的生命周期函数之一
  onLoad: function() {
    // 启动倒计时
    this.startCountdown();
    
    // 初始化音频系统
    this.initAudio();
    
    // 新增：从本地存储加载喜欢列表
    try {
      const savedFavoriteList = wx.getStorageSync('favoriteList');
      if (savedFavoriteList && Array.isArray(savedFavoriteList)) {
        this.setData({
          favoriteList: savedFavoriteList
        });
      }
    } catch (error) {
      console.log('加载喜欢列表失败:', error);
    }
  },

  // onUnload: 页面卸载时执行的函数，清理定时器
  onUnload: function() {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    if (this.tipMessageTimer) {
      clearTimeout(this.tipMessageTimer);
    }
  },

  // 新增：启动午餐倒计时功能
  startCountdown: function() {
    const updateCountdown = () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0); // 今天12:00
      
      // 如果已经过了今天12点，则计算到明天12点的时间
      if (now > today) {
        today.setDate(today.getDate() + 1);
      }
      
      const timeDiff = today - now;
      
      if (timeDiff > 0) {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        this.setData({
          countdown: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        });
      } else {
        this.setData({
          countdown: '午餐时间!'
        });
      }
    };
    
    // 立即执行一次
    updateCountdown();
    
    // 每秒更新一次
    setInterval(updateCountdown, 1000);
  },

  // 新增：随机选择店铺的函数
  selectRandomShop: function(foodType) {
    const shops = this.data.shopDatabase[foodType];
    if (shops && shops.length > 0) {
      const randomIndex = Math.floor(Math.random() * shops.length);
      return shops[randomIndex];
    }
    return null;
  },

  // 新增：显示自定义消息框的函数
  showCustomMessage: function(message, duration = 60000) {
    // 清除之前的定时器
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    
    // 显示消息
    this.setData({
      showCustomToast: true,
      toastMessage: message
    });
    
    // 设置定时器，指定时间后隐藏消息框
    this.toastTimer = setTimeout(() => {
      this.setData({
        showCustomToast: false,
        toastMessage: ''
      });
    }, duration);
  },

  // 新增：触发中奖特效的函数
  triggerJackpotEffect: function() {
    // 显示中奖特效
    this.setData({
      showJackpotEffect: true
    });
    
    // 强震动反馈，兼容iOS
    try {
      const systemInfo = wx.getSystemInfoSync();
      const isIOS = systemInfo.platform === 'ios';
      
      if (isIOS) {
        // iOS使用基础长震动
        wx.vibrateLong();
      } else {
        // Android可以使用长震动
        wx.vibrateLong();
      }
    } catch (error) {
      console.log('长震动失败:', error);
      // 降级到短震动
      try {
        wx.vibrateShort();
      } catch (fallbackError) {
        console.log('备用震动失败:', fallbackError);
      }
    }
    
    // 3秒后隐藏特效
    setTimeout(() => {
      this.setData({
        showJackpotEffect: false
      });
    }, 3000);
  },

  // 新增：触发积分增加特效的函数
  triggerScoreEffect: function(bonusScore) {
    // 显示积分增加特效
    this.setData({
      showScoreEffect: true,
      scoreEffectText: `+${bonusScore}`
    });
    
    // 轻震动反馈，兼容iOS
    try {
      const systemInfo = wx.getSystemInfoSync();
      const isIOS = systemInfo.platform === 'ios';
      
      if (isIOS) {
        // iOS使用基础短震动
        wx.vibrateShort();
      } else {
        // Android可以使用重型震动
        wx.vibrateShort({
          type: 'heavy'
        });
      }
    } catch (error) {
      console.log('震动反馈失败:', error);
      // 降级到基础震动
      try {
        wx.vibrateShort();
      } catch (fallbackError) {
        console.log('备用震动失败:', fallbackError);
      }
    }
    
    // 1.5秒后隐藏特效
    setTimeout(() => {
      this.setData({
        showScoreEffect: false,
        scoreEffectText: ''
      });
    }, 1500);
  },

  // startSpin: 开始旋转食物选择器的函数，当用户点击"吃什么"按钮时触发
  startSpin: function() {
    // 检查积分是否足够
    if (this.data.currentScore <= 0) {
      this.showCustomMessage('积分不足，无法选择!', 3000);
      return;
    }
    
    // 如果食物选择器已经在旋转，则直接返回，防止用户重复点击按钮
    if (this.data.isSpinning) return;
    
    // 先扣除1积分
    this.setData({
      currentScore: this.data.currentScore - 1
    });
    
    // 设置页面数据，标记食物选择器开始旋转，清除之前选中的食物和店铺
    this.setData({
      isSpinning: true,
      selectedFood: null,
      selectedShop: null
    });
    
    // 先生成最终结果，考虑喜欢的美食概率提升
    const cellCount = this.data.foodCells.length;
    let finalRandomIndex;
    
    // 获取所有喜欢的美食索引
    const favoriteIndexes = [];
    for (let i = 0; i < cellCount; i++) {
      if (this.data.favoriteList[i] === true) {
        favoriteIndexes.push(i);
      }
    }
    
    // 如果有喜欢的美食，30%概率选择喜欢的美食
    if (favoriteIndexes.length > 0 && Math.random() < 0.3) {
      // 从喜欢的美食中随机选择一个
      const randomFavoriteIndex = Math.floor(Math.random() * favoriteIndexes.length);
      finalRandomIndex = favoriteIndexes[randomFavoriteIndex];
    } else {
      // 普通随机选择
      finalRandomIndex = Math.floor(Math.random() * cellCount);
    }
    
    const selectedFood = this.data.foodCells[finalRandomIndex];
    
    // 定义旋转相关的参数
    let duration = 4000;  // 减少总时长，为渐慢阶段留时间
    let interval = 80;
    let currentTime = 0;
    let currentIndex = 0;
    
    // 计算需要转多少圈才能停在目标位置
    const minRotations = 2;  // 改为至少转2圈
    const totalSteps = minRotations * cellCount + finalRandomIndex;
    let stepCount = 0;
    
    // 创建旋转动画定时器
    const spinTimer = setInterval(() => {
      currentTime += interval;
      stepCount++;
      
      this.setData({
        activeIndex: currentIndex % cellCount
      });
      
      // 播放转圈音效
      this.playTickSound();
      
      currentIndex++;
      
      // 计算剩余步数
      const remainingSteps = totalSteps - stepCount;
      
      // 前面正常转动和加速
      if (remainingSteps > 15) {
        if (currentTime > duration * 0.4) {
          interval = Math.min(200, interval * 1.05);
        }
      }
      // 最后15步：每一步都比前一步慢，增加慢速倍数
      else if (remainingSteps > 0) {
        // 根据剩余步数计算延迟倍数，步数越少延迟越大
        const slowFactor = 1 + (15 - remainingSteps) * 1.5;  // 从1.0逐渐增加到22.0，极端减速
        interval = Math.min(2000, interval * slowFactor);  // 增加最大延迟限制到2000ms
      }
      
      // 当达到预定的步数时停止
      if (stepCount >= totalSteps) {
        clearInterval(spinTimer);
        
        // 随机选择对应类型的店铺
        const selectedShop = this.selectRandomShop(selectedFood.name);
        
        // 计算积分奖励
        let bonusScore = 0;
        if (selectedFood.multiplier) {
          // 提取倍数数字，如从"×25"中提取25
          const multiplierMatch = selectedFood.multiplier.match(/×(\d+)/);
          if (multiplierMatch) {
            bonusScore = parseInt(multiplierMatch[1]);
          }
        }
        
        // 更新积分
        const newScore = this.data.currentScore + bonusScore;
        
        this.setData({
          activeIndex: finalRandomIndex,
          selectedFood: selectedFood,
          selectedShop: selectedShop,
          isSpinning: false,
          spinCount: this.data.spinCount > 0 ? this.data.spinCount - 1 : 0,
          currentScore: newScore
        });
        
        // 检查是否中了777幸运奖，触发特效
        if (selectedFood.name === '777幸运奖') {
          this.triggerJackpotEffect();
        }
        
        // 显示结果提示
        const bonusInfo = bonusScore > 0 ? `获得 ${bonusScore} 积分奖励!` : '';
        
        // 只显示积分奖励信息，不显示店铺推荐
        if (bonusInfo) {
          this.showCustomMessage(bonusInfo);
          // 触发积分增加特效（只有获得积分时才触发）
          this.triggerScoreEffect(bonusScore);
        }
      }
    }, interval);
  },
  
  // onShareAppMessage: 用户点击分享按钮时触发的函数，用于自定义分享内容
  onShareAppMessage: function() {
    return {
      title: 'ITC吃什么？帮你随机选择美食！',
      path: '/pages/index/index'
    }
  },

  // 新增：初始化音频系统
  initAudio: function() {
    try {
      // 初始化成功标记，不再使用复杂的音频
      this.setData({
        audioContext: 'ready'
      });
      console.log('反馈系统初始化成功');
    } catch (error) {
      console.log('反馈系统初始化失败:', error);
    }
  },

  // 新增：播放转圈音效
  playTickSound: function() {
    try {
      const now = Date.now();
      // 控制反馈间隔，避免过于频繁（恢复到50ms）
      if (now - this.data.lastSoundTime < 50) {
        return;
      }
      
      // 获取系统信息，判断是否为iOS
      const systemInfo = wx.getSystemInfoSync();
      const isIOS = systemInfo.platform === 'ios';
      
      // 使用震动反馈作为转圈提示，针对iOS优化
      if (isIOS) {
        // iOS使用基础的vibrateShort，不带参数
        wx.vibrateShort();
      } else {
        // Android可以使用带类型的震动
        wx.vibrateShort({
          type: 'light'
        });
      }
      
      // 更新最后播放时间
      this.setData({
        lastSoundTime: now
      });
    } catch (error) {
      console.log('播放反馈失败:', error);
      // 如果震动失败，尝试最基础的震动API
      try {
        wx.vibrateShort();
      } catch (fallbackError) {
        console.log('基础震动也失败:', fallbackError);
      }
    }
  },

  // 新增：toggleFavorite方法，用于处理长按事件
  toggleFavorite: function(event) {
    const index = parseInt(event.currentTarget.dataset.index);
    const foodName = this.data.foodCells[index].name;
    const isFavorite = this.data.favoriteList[index] === true;
    
    // 更新喜欢状态
    const newFavoriteList = [...this.data.favoriteList];
    newFavoriteList[index] = !isFavorite;
    
    this.setData({
      favoriteList: newFavoriteList
    });
    
    // 提供触觉反馈
    wx.vibrateShort();
    
    // 显示提示信息
    const message = !isFavorite ? 
      `❤️ 已喜欢 ${foodName}，转到概率提升至30%！` : 
      `取消喜欢 ${foodName}`;
    this.showCustomMessage(message, 2000);
    
    // 将喜欢列表保存到本地存储
    wx.setStorageSync('favoriteList', newFavoriteList);
  },

  // 新增：显示提示信息的方法
  showTipMessage: function() {
    // 清除之前的定时器
    if (this.tipMessageTimer) {
      clearTimeout(this.tipMessageTimer);
    }
    
    // 显示专门的提示消息框
    this.setData({
      showTipMessageBox: true
    });
    
    // 提供触觉反馈
    wx.vibrateShort();
    
    // 3秒后隐藏消息框
    this.tipMessageTimer = setTimeout(() => {
      this.setData({
        showTipMessageBox: false
      });
    }, 3000);
  },

  // 新增：显示反馈信息的方法
  showFeedbackMessage: function() {
    // 清除之前的定时器
    if (this.feedbackMessageTimer) {
      clearTimeout(this.feedbackMessageTimer);
    }
    
    // 显示反馈消息框，复用提示消息框的样式
    this.setData({
      showTipMessageBox: true,
      feedbackMessageText: '如需要添加店铺请发给Peter~'
    });
    
    // 提供触觉反馈
    wx.vibrateShort();
    
    // 3秒后隐藏消息框
    this.feedbackMessageTimer = setTimeout(() => {
      this.setData({
        showTipMessageBox: false,
        feedbackMessageText: ''
      });
    }, 3000);
  }
})