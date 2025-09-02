# lab4
## **一、实验目标**

-  掌握视频API的操作方法；
-  掌握如何发送随机颜色的弹幕。




## 二、实验步骤

### 2.1 实验前准备

- 实验会用到的**视频网址**如下：

  ```js
  list: [{ 
  
     id: '1001', 
  
     title: '杨国宜先生口述校史实录', 
  
     videoUrl: 'http://arch.ahnu.edu.cn/__local/6/CB/D1/C2DF3FC847F4CE2ABB67034C595_025F0082_ABD7AE2.mp4?e=.mp4' 
  
    }, 
  
    { 
  
     id: '1002', 
  
     title: '唐成伦先生口述校史实录', 
  
     videoUrl: 'http://arch.ahnu.edu.cn/__local/E/31/EB/2F368A265E6C842BB6A63EE5F97_425ABEDD_7167F22.mp4?e=.mp4' 
  
    }, 
  
    { 
  
     id: '1003', 
  
     title: '倪光明先生口述校史实录', 
  
     videoUrl: 'http://arch.ahnu.edu.cn/__local/9/DC/3B/35687573BA2145023FDAEBAFE67_AAD8D222_925F3FF.mp4?e=.mp4' 
  
    }, 
  
    { 
  
     id: '1004', 
  
     title: '吴仪兴先生口述校史实录', 
  
     videoUrl: 'http://arch.ahnu.edu.cn/__local/5/DA/BD/7A27865731CF2B096E90B522005_A29CB142_6525BCF.mp4?e=.mp4' 
  
    }] 
  
   },
  ```

- 实验会用到一个**视频播放按钮图标**，在如下网址下载：

  https://gaopursuit.oss-cn-beijing.aliyuncs.com/2022/images_play.zip



### 2.2 操作步骤

- <span style="color:#7D7DDE; font-weight:bold">项目创建</span>
  - **删除多余的`"pages/logs/logs"`**，仅留下首页index。

  - **删除utils文件夹**。utils是存放工具函数的文件夹，当前小程序可不使用。

  - **删除pages下的logs**。logs是官方用于演示的额外界面。

  - **删除index.wxml、 index.wxss 和 index.js中的全部代码。**此三文件是构成页面设计的核心文件，也是后续需要重点改写的文件。

  - **删除app.wxss 和 app.js中的全部代码。**值得注意的是：只有界面会有wxml文件和局部样式wxss，总app只能设置wxss样式。

  - **在项目中新建images文件夹**，将准备时下载的图标`play.png`放入。
- <span style="color:#7D7DDE; font-weight:bold">外观改造</span>
  - 在`app.json`中更改整体外观设计，加上标题。


- <span style="color:#7D7DDE; font-weight:bold">index页面总体设计</span>

  - **区域划分**

    - 区域1：视频播放器，用于播放指定视频。
    - 区域2：弹幕发送区，包含文本输入框和发送按钮。
    - 区域3：视频列表，纵向排列多个视频标题，点击可切换视频。

  - **组件设计**

    - 区域1：使用 `<video>` 组件。
    - 区域2：使用 `<view>` 组件，class="danmuArea"。
    - 区域3：使用 `<view>` 组件，class="videoList"。

  - **wxml和wxss代码如下：**

    ```html
    <video id = 'myVideo' controls></video>
    <view class="danmuArea">
      <input type="text" placeholder="请输入弹幕内容"></input>
      <button>发送弹幕</button>
    </view>
    
    <view class="videoList">
      <view class="videoBar">
        <image src="/images/play.png"></image>
        <text>我是标题</text>
      </view>
    </view>
    ```

    ```css
    /* 视频播放器样式：宽度占满父容器 */
    video{
      width: 100%;
    }
    
    /* 弹幕区域：水平排列输入框和按钮 */
    .danmuArea{
      display: flex;
      flex-direction: row;
    }
    
    /* 输入框样式：边框、可伸展，占据剩余空间 */
    input{
      border: 1rpx solid #987938;
      flex-grow: 1;
      height: 100rpx;
    }
    
    /* 按钮样式：白色文字，背景色与整体主题一致 */
    button{
      color: white;
      background-color: #987938;
    }
    
    /* 视频列表：占满宽度，最小高度设为 400rpx */
    .videoList{
      width: 100%;
      min-height: 400rpx;
    }
    
    /* 视频条目：横向排列，底部分隔线，左右留白 */
    .videoBar{
      width: 95%;
      display: flex;
      flex-direction: row;
      border-bottom: 1rpx solid #987938;
      margin: 10rpx;
    }
    
    /* 视频缩略图（播放图标）样式：固定大小并留边距 */
    image{
      width: 70rpx;
      height: 70rpx;
      margin: 20rpx;
    }
    
    /* 视频标题样式：文字大小、颜色，自动扩展填充剩余空间 */
    text{
      font-size: 45rpx;
      color: #987938;
      margin: 20rpx;
      flex-grow: 1;
    }
    ```

    

- <span style="color:#7D7DDE; font-weight:bold">视频播放列表设计</span>

  - 视频列表应有多个视频，所以区域3需要使用`<view>`组件改造一个可扩展的多行区域，每行包含一个播放图标和一个视频标题文本。原来已经设计出了第一行的效果，现在使用 `wx:for` 属性循环添加全部内容。
  - 修改`index.wxml`的代码。
  - 在`index.js`文件中的`data`中增加实验前准备的`list`数组，用来存放视频信息。
```js
Page({
    /**
   * 页面的初始数据
   */
  data: {
    danmuTxt:'',
    list: [{ 
      id: '1001', 
      title: '杨国宜先生口述校史实录', 
      videoUrl: 'http://arch.ahnu.edu.cn/__local/6/CB/D1/C2DF3FC847F4CE2ABB67034C595_025F0082_ABD7AE2.mp4?e=.mp4' 
    }, 
    { 
      id: '1002', 
      title: '唐成伦先生口述校史实录', 
      videoUrl: 'http://arch.ahnu.edu.cn/__local/E/31/EB/2F368A265E6C842BB6A63EE5F97_425ABEDD_7167F22.mp4?e=.mp4' 
    }, 
    { 
      id: '1003', 
      title: '倪光明先生口述校史实录', 
      videoUrl: 'http://arch.ahnu.edu.cn/__local/9/DC/3B/35687573BA2145023FDAEBAFE67_AAD8D222_925F3FF.mp4?e=.mp4' 
    }, 
    { 
      id: '1004', 
      title: '吴仪兴先生口述校史实录', 
      videoUrl: 'http://arch.ahnu.edu.cn/__local/5/DA/BD/7A27865731CF2B096E90B522005_A29CB142_6525BCF.mp4?e=.mp4' 
    }] 
  }
})



- <span style="color:#7D7DDE; font-weight:bold">设置触发事件</span>

  - 将区域1的视频源`src`改为变量。

  - 再次修改`index.wxml`文件，在`<view class = "videoBar">`组件中添加`data-url`、`bindtap`

    > <span style="color:#008b8d">`data-url`指每行视频的播放地址，`bindtap`用于触发点击事件，`playVideo`是后面自定义的函数。</span>

  - 在`index.js`的`Page`中`onLoad`函数中创建视频上下文，用来控制视频播放与停止。

    ```js
      onLoad: function (options) {
        this.videoCtx = wx.createVideoContext('myVideo')
      },
    ```

  - 同样在`index.js`的`Page`中填写`playVedio`函数。

    ```js
      playVideo:function(e){
        this.videoCtx.stop()  //暂停
        this.setData({
          src:e.currentTarget.dataset.url //更新视频地址
        })  
        this.videoCtx.play()  //播放新的视频
      }
    ```

- <span style="color:#7D7DDE; font-weight:bold">发送弹幕</span>

  - 在`<video>`组件中添加`enable-danmu`和`danmu-btn`属性。前者用来允许发送弹幕，后者用来显示“发送弹幕”的按钮。
  - 将弹幕发送区域中的`<input>`组件添加`bindinput`属性，`<button>`组件添加`bindtap`属性。前者用于获取弹幕文本内容，后者用于触发点击事件。
  - 修改对应的`JS`文件，在data中添加`danmuTxt`字段，然后自定义`getDanmu`和`sendDanmu`函数。
  - 在`JS`文件中补充`getRandomColor`函数，并修改相应片段，使得代码可以生成**多种颜色**的弹幕。
  - **修改代码**如下：

```html
<video id = "myVideo" src = "{{src}}" controls enable-danmu danmu-btn></video>

<view class="danmuArea">
  <input type="text" placeholder="请输入弹幕内容" bindinput="getDanmu"></input>
  <button bindtap = "sendDanmu">发送</button>
</view>

```

```js
function getRandomColor() {
  let rgb = [];
  for (let i = 0; i < 3; i++) {
    let color = Math.floor(Math.random() * 256).toString(16);
    color = color.length === 1 ? '0' + color : color;
    rgb.push(color);
  }
  return '#' + rgb.join('');
}

Page({
    /**
   * 页面的初始数据
   */
  data: {
    danmuTxt:'',
   // 省略 list: [] 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.videoCtx = wx.createVideoContext('myVideo')
  },

  playVideo:function(e){
    this.videoCtx.stop()  //暂停
    this.setData({
      src:e.currentTarget.dataset.url
    })  //更新视频地址
    this.videoCtx.play()  //播放新的视频
  },
  
  getDanmu:function(e){
    this.setData({
      danmuTxt:e.detail.value
    })
  },

  sendDanmu:function(e){
    let text = this.data.danmuTxt;
    this.videoCtx.sendDanmu({
      text:text,
      color:getRandomColor()
    })
  }
})


```



## 三、程序运行结果

成功实现选择视频并发送弹幕的功能。

## 四、问题总结与体会

### 4.1 问题总结

**问题1：在设置触发事件完毕后发现无法加载视频。**

**方案：**发现没有将区域1的视频源`src`改为变量。

### 4.2 体会

整个实验的过程非常有趣，特别是当看到自己输入的文字以不同颜色在视频上飘过时，感觉把在自己心目中特别困难的一项工作用很简单的方式做了出来（虽然非常简陋）。我也体会到了前端开发中细节的重要性，比如忘记把视频源设置成变量就会导致视频无法加载（大概我们就是要在大大小小的bug中挣扎并解决问题）。
