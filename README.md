# lab2
## **一、实验目标**

- 创建可以查询天气的小程序。

## 二、实验步骤

### 2.1 天气信息获取

- <span style="color:#7D7DDE; font-weight:bold;">概述</span>

  - 小程序的核心要素在于获取实时的天气信息，所以需要记录访问服务器的**地址（域名部分）API Host**，和向服务器申请访问数据的**身份凭证API Key**.

  

- <span style="color:#7D7DDE; font-weight:bold;">注册并获取API Host</span>

  - 注册网址[https://dev.qweather.com/](https://dev.qweather.com/)。在个人界面复制**API Host**，并在微信小程序开发管理界面https://mp.weixin.qq.com/wxamp/将该API Host加入白名单（注意要输入带https://的完整域名）。

  - > <span style="color:#008b8d">**API Host**是访问接口的**服务器地址**。旧版为统一的`https://api.qweather.com`（系统只能靠 **API Key** 来区分用户），而新版则为每一个用户生成了专属的域名，起到了流量分别统计和控制的作用。</span>

  

- <span style="color:#7D7DDE; font-weight:bold;">生成项目并获取API Key</span>

  - 注册项目并选择生成API Key凭证，注册方法[项目和凭据 | 和风天气开发服务 (qweather.com)](https://dev.qweather.com/docs/configuration/project-and-key/)。

  - > <span style="color:#008b8d">**API Key**是身份凭证，表明这是谁的账号在调用接口，服务器根据此进行调用收费、权限控制。在代码中调用时要加上对应的**请求头"X-QW-Api-Key": "APIKEY" 。**</span>

### 2.2 小程序项目创建

- <span style="color:#7D7DDE; font-weight:bold">准备工作</span>

  - **删除多余的`"pages/logs/logs"`**，仅留下首页index。

  - **删除utils文件夹**。utils是存放工具函数的文件夹，当前小程序可不使用。

  - **删除pages下的logs**。logs是官方用于演示的额外界面。

  - **删除index.wxml、 index.wxss 和 index.js中的全部代码。** 此三文件是构成页面设计的核心文件，也是后续需要重点改写的文件。

  - **删除app.wxss 和 app.js中的全部代码。** 值得注意的是：只有界面会有wxml文件和局部样式wxss，总app只能设置wxss样式。

  - **在项目中新建images文件夹**，创建二级目录**image_icon**存放天气图卡（自行找压缩包下载）。

    > <span style="color:#008b8d">小程序中还可能有其余图片，二级目录方便管理。</span>

- <span style="color:#7D7DDE; font-weight:bold">导航栏设计</span>

  - 导航栏是全局元素，故要在app.json中完成配置。

    ```json
    {
     "pages": ["pages/index/index"],
     "window": {
      "navigationBarTitleText": "天气查询",
      "navigationBarBackgroundColor": "#f0c0cb", // 粉色
      "navigationBarTextStyle": "black",
      "backgroundTextStyle": "dark"
     },
     "style": "v2",
     "sitemapLocation": "sitemap.json",
     "permission": {
     "scope.userLocation": { "desc": "用于根据定位查询当地天气" }
     }
    
    }
    ```

    

### 2.3 从静态到动态

- <span style="color:#7D7DDE; font-weight:bold">总括</span>
  - 页面的设计过程主要涉及到该页面的**WXML（结构文件）、WXSS（样式设计）、JS（逻辑文件）**，往往为以下三个步骤：
    - **1.先写样式**（WXSS），用静态内容把布局搭出来。
    - **2.在 JS 的 data 里写默认值**，用 `{{变量}}` 在 WXML 中替换静态文本。
    - **3.在 JS 里调 API 更新数据**，用 `this.setData` 把实时数据渲染到页面。



- <span style="color:#7D7DDE; font-weight:bold">页面设计</span>

  - 先对WXML组织结构，**总体上**：

    - 页面整体使用 `<view>` 组件，并设置 `class="container"`。
    - 页面分为 **4 个区域**，分别负责不同的功能。

  - **区域上**

    - **1：地区选择器**使用 `<picker>` 组件，用户可以自行选择查询的省、市、区。

    - **2：温度和天气状态**使用 `<text>` 组件，显示当前城市的温度和天气状况说明文字。

    - **3：天气图标**使用 `<image>` 组件，显示当前城市对应的天气图标。

    - **4：其他天气信息（多行展示）**

      

- <span style="color:#7D7DDE; font-weight:bold">静态设计</span>

  - **代码**：此处可以直接到页面设计的第二步，用 `{{变量}}` 在 WXML 中替换静态文本，并在JS的this.data中写入默认值。

```html
<!-- index.wxml -->
<view class="container">
  <!-- 区域1：地区选择器 -->
  <picker mode="region" bindchange="onRegionChange">
    <view class="region">
      {{region[1]}}{{region[2]}}
    </view>
  </picker>

  <!-- 区域2：单行天气信息 -->
  <view class="temp">{{nowTemp}}°C {{nowText}}</view>

  <!-- 区域3：天气图标 -->
    <image src="/images/weather_icon/{{icon}}.png" mode="widthFix"></image>

  <!-- 区域4：多行天气信息 -->
  <view class="detail">
    <view class="bar">
      <view class="box">湿度</view>
      <view class="box">气压</view>
      <view class="box">能见度</view>
    </view>
    <view class="bar">
      <view class="box">{{humidity}} %</view>
      <view class="box">{{pressure}} hPa</view>
      <view class="box">{{vis}} km</view>
    </view>
    <view class="bar">
      <view class="box">风向</view>
      <view class="box">风速</view>
      <view class="box">风力</view>
    </view>
    <view class="bar">
      <view class="box">{{windDir}}</view>
      <view class="box">{{windSpeed}} km/h</view>
      <view class="box">{{windScale}} 级</view>
    </view>
  </view>
</view>
```

```js
// index.js
Page({
  data: {
    region: ["广东省", "广州市", "天河区"],

    // 天气数据（默认填静态值，接 API 后替换）
    nowTemp: 19,
    nowText: "晴",
    humidity: 0,
    pressure: 0,
    vis: 0,
    windDir: "无",
    windSpeed: 0,
    windScale: 0
    icon: 999
  },

  onRegionChange(e) {
    // e.detail.value = [省, 市, 区]
    this.setData({ region: e.detail.value }); // 后会将变量this.data渲染为实时数据

    // 先用静态数据占位
    this.setData({
      nowTemp: 26,
      nowText: "多云",
      humidity: 50,
      pressure: 1005,
      vis: 10,
      windDir: "东北风",
      windSpeed: 15,
      windScale: 3
      icon: 999
    });
  }
});
```



- <span style="color:#7D7DDE; font-weight:bold">动态设计</span>
  - 补充` onLoad() `，让小程序加载时能显示一个默认地区的实时天气；
  - 补充`onRegionChange(e)`，提取出来用户新选择的地区，并将数据实时风行到WXML中；
  - 在找寻天气数据的` getWeather(cityName) `中，首先要把传入的文本变量cityname转换成该城市对应的唯一ID ，请求方式url: `${API_HOST}/geo/v2/city/lookup`（https://dev.qweather.com/docs/api/geoapi/city-lookup/）；
  - 查询实时天气数据，`this.setData({...})` 会把这些值更新到页面绑定的变量里，WXML 会自动刷新显示。请求方式 url: `${API_HOST}/v7/weather/now`（https://dev.qweather.com/docs/api/weather/weather-now/）
  - **代码**：修改js文件调用API接口即可。

```js
Page({
  data: {
    region: ["广东省", "广州市", "天河区"],
    nowTemp: "--",
    nowText: "N/A",
    humidity: "--",
    pressure: "--",
    vis: "--",
    windDir: "--",
    windSpeed: "--",
    windScale: "--",
    icon: "999"
  },

  onLoad() { // 生命周期函数，页面第一次加载时自动执行
    this.getWeather("广州");
  },

  onRegionChange(e) {
    const regionArr = e.detail.value; // e.detail.value：用户选择后的地区数组
    this.setData({ region: regionArr }); // 把用户选择的地区更新到页面数据里，这样 WXML 里的 {{region}} 会同步显示。

    // region[1] 是市级名字
    const city = regionArr[1];
    this.getWeather(city); // 调用天气查询函数，显示用户选中的城市天气。
  },

  getWeather(cityName) {
    const API_HOST = " ";  // 隐私省略
    const API_KEY = " "; // 隐私省略

    wx.request({ // 把 "广州" 这样的城市名转换成唯一的城市 ID。
      url: `${API_HOST}/geo/v2/city/lookup`,
      method: "GET",
      data: { location: cityName }, // 把城市名传给 API。
      header: { "X-QW-Api-Key": API_KEY },  // 在请求头里带上 API Key，用来验证身份。
      success: (res) => {
        if (res.data && res.data.location && res.data.location.length > 0) {
          const cityId = res.data.location[0].id; // 返回城市 ID

          wx.request({ // 查询实时天气数据
            url: `${API_HOST}/v7/weather/now`,
            method: "GET",
            data: { location: cityId },
            header: { "X-QW-Api-Key": API_KEY },
            success: (res2) => {
              if (res2.data && res2.data.now) {
                const now = res2.data.now;
                this.setData({
                  nowTemp: now.temp,
                  nowText: now.text,
                  humidity: now.humidity,
                  pressure: now.pressure,
                  vis: now.vis,
                  windDir: now.windDir,
                  windSpeed: now.windSpeed,
                  windScale: now.windScale,
                  icon: now.icon   
                });
              }
            }
          });
        }
      }
    });
  }
});

```


## 三、程序运行结果

选取城市可以获得实时天气信息。

## 四、问题总结与体会

### 4.1 问题总结

**问题1：在本次实验开始的时候有点蒙，操作文档中有很多过期的链接和繁琐的步骤，让我不懂从哪里开始。**

**方案：** 先让GPT帮忙整理了开始的思路，解释清楚了一部分概念，参考了现有的文档开始着手做，变做边学。

**问题2：中间有一个小时界面一直没有渲染出来，也排查不出来问题。**

**方案：** 先保存后重启。要先保存再编译，及时清理缓存，不行的时候可以试试重启，毕竟计算机是一个充满不确定的实体。

### 4.2 体会

- 本次课程最大的收获是学习了API的调用，软件设计一定是一个用无数轮子造车的过程，API就是将轮子装上车的接口，在阅读说明文档和动手实践的过程中学会它的使用无疑是重要的。
- 另一方面，也提醒我学习计算机应当注重细节。用一个小时的时间排查问题最后发现保存重启就能解决确实挺让人不开心的，还是希望自己能够注重效率、抓牢细节。
