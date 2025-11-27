## **一、实验目标**

- 综合所学知识创建完整的推箱子游戏。

- 能够在开发过程中熟练掌握真机预览、调试等操作。

  


## 二、实验步骤

### 2.1 实验前准备

- <span style="color:#7D7DDE; font-weight:bold">项目创建</span>
  - 本次实验需要两个页面：**index（主页面）**和 **game（游戏页面）**。因此，应在 `pages` 目录下分别创建 `index` 和 `game` 两个文件夹。在`app.json`中将的`"pages/logs/logs"`改为`"pages/game/game"`（文件保存后会自动创建`game`文件夹），删除**旧pages下的logs文件夹**。
  - 在项目根目录下新建一个 `images` 文件夹，并将下载好的图片资源放入其中。
  - 清空 `utils` 文件夹，并在其中新建 `data.js` 文件，用于存放公共的`JS`文件。
  - **删除index.wxml、 index.wxss 和 index.js中的全部代码。**此三文件是构成页面设计的核心文件，也是后续需要重点改写的文件。
  - **删除app.wxss 和 app.js中的全部代码。**值得注意的是：只有界面会有wxml文件和局部样式wxss，总app只能设置wxss样式。


### 2.2 基础设计

- <span style="color:#7D7DDE; font-weight:bold">外观改造</span>
  - 在`app.json`中更改整体外观设计，加上标题。


- <span style="color:#7D7DDE; font-weight:bold">样式设计</span>

  - **公共样式设计**

    ```css
    /**app.wxss**/
    .container{
      height: 100vh;
      color: #e64340;
      font-weight: bold;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
    }
    .title{
      font-size: 18pt;
    }
    ```

- <span style="color:#7D7DDE; font-weight:bold">首页设计</span>

  - 首页最终会包含四个关卡，但是在初期做静态界面可以只设计**第一个关卡**的静态占位和表示，首页代码如下:

  - ```html
    <!--index.wxml-->
    <view class="container">
      <view class="title">游戏选关</view>
      <view class="levelBox">
        <view class="box">
          <image src="/images/level01.png"/><image>
          <text>第 1 关</text>
        </view>
      </view>
    </view>
    ```

    ```css
    /**index.wxss**/
    .levelBox{
      width: 100%;
    }
    .box{
      width: 50%;
      float: left;
      margin: 20rpx 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    image{
      width: 300rpx;
      height: 300rpx;
    }
    ```

    

- <span style="color:#7D7DDE; font-weight:bold">游戏页面设计</span>

  - 游戏页面需要用户点击首页的关卡列表，然后在新窗口中打开该页面。游戏页面包括**游戏关卡标题、游戏画面、方向键和“重新开始”的按钮**。由于暂时没有做点击跳转的逻辑设计，所以可以在开发工具顶端选择“普通编译”下的**“添加编译模式”**,并携带临时测试参数level=0。
  - 游戏页面的具体代码如下：

```html
<!--pages/game/game.wxml-->
<view class="container">
  <view class="title">第 1 关</view>
  <canvas canvas-id="myCanvas"></canvas>
  <view class="btnBox">
    <button type="warn" bind:tap="up">↑</button>
    <view>
      <button type="warn" bind:tap="left">←</button>
      <button type="warn" bind:tap="down">↓</button>
      <button type="warn" bind:tap="right">→</button>
    </view>
  </view>
  <button type="warn" bind:tap="restartGame">重新开始</button>
</view>
```

```css
/* pages/game/game.wxss */
canvas{
  border: 1rpx solid;
  width: 320px;
  height: 320px;
}
.btnBox{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.btnBox view{
  display: flex;
  flex-direction: row;
}
.btnBox button{
  width: 90rpx;
  height: 90rpx;
}
button{
  margin: 10rpx;
}
```


### 2.3 公共逻辑

- 在公共JS文件`utils/data.js`中配置8x8的游戏地图的数据。

- 再使用 `module.exports`语句暴露数据出口，最终代码如下：

  ```js
  //1为墙，2为路，3为终点，4为箱，5为人物，0为地图边缘
  
  // 关卡 1
  var map1 = [
    [0, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 2, 2, 1, 1, 1, 0],
    [0, 1, 5, 4, 2, 2, 1, 0],
    [1, 1, 1, 2, 1, 2, 1, 1],
    [1, 3, 1, 2, 1, 2, 2, 1],
    [1, 3, 4, 2, 2, 1, 2, 1],
    [1, 3, 2, 2, 2, 4, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
  ]
  
  // 关卡 2-4同理
  
  module.exports = {
    maps:[map1,map2,map3,map4]
  }
  ```

- 最后需要在`game.js`顶端引用公共`data.js`文件，引用代码如下：

  ```js
  var data =require('../../utils/data. js')   //引用公共JS文件
  ```



### 2.4 修改首页APP

- 为在首页展示完整的四个界面，需要先更改`index.js`的`data`字段以展现4个关卡图片，代码如下：

  ```js
  data: {
    levels: [
     'level01.png',
     'level02.png',
     'level03.png',
     'level04.png'
    ]
   },
  ```

- 将相应`WXML`文件由静态转向动态，并增加跳转设置。在相应的`JS`文件的`Page`中增加相应函数：

  ```html
  <!-- 关卡列表 -->
   <view class="levelBox">
    <view class="box" wx:for="{{levels}}" wx:key="levels{{index}}" bind:tap="chooseLevel" data-level="{{index}}">
     <image src="/images/{{item}}"></image>
     <text>第{{index+1}}关</text>
    </view>
   </view>
  ```

  ```js
    chooseLevel: function (e) {
      let level = e.currentTarget.dataset.level
      wx.navigateTo({
        url: '/pages/game/game?level=' + level
      })
    }
  ```

- **至此，`Index`首页 APP设计完毕。**



### 2.5 修改游戏界面APP

- <span style="color:#7D7DDE; font-weight:bold">修改`JS`逻辑文件</span>

  - 在`game.js`的顶端记录游戏的初始信息：

  ```js
  // 地图图层数据
  var map = [
  // 省略8*8个0
  ]
  
  // 箱子图层数据
  var box = [
  // 省略8*8个0
  ]
  
  // 方块的宽度
  var w = 40
  
  // 初始化游戏主角(小鸟)的行与列
  var row = 0
  var col = 0
  ```

  - 在`game.js`的`Page`中定义初始化地图的函数和绘制信息的函数：

  ```js
    initMap: function (level) {
      let mapData = data.maps[level]   // level 是从 0 开始的索引
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          box[i][j] = 0
          map[i][j] = mapData[i][j]
  
          if (mapData[i][j] == 4) {
            // 地图里 4 表示该格原本是道路/目标上有一个箱子
            box[i][j] = 4
            map[i][j] = 2
          } else if (mapData[i][j] == 5) {
            // 5 表示主角初始位置
            map[i][j] = 2
            row = i
            col = j
          }
        }
      }
    },
  
    /**
     * 绘制画布
     */
    drawCanvas: function () {
      let ctx = this.ctx
      ctx.clearRect(0, 0, 320, 320)
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          let img = 'ice'       // 0/2 统称地面
          if (map[i][j] == 1) {
            img = 'stone'       // 墙
          } else if (map[i][j] == 3) {
            img = 'pig'         // 目标点
          }
          ctx.drawImage('/images/icons/' + img + '.png', j * w, i * w, w, w)
  
          if (box[i][j] == 4) {
            ctx.drawImage('/images/icons/box.png', j * w, i * w, w, w)
          }
        }
      }
      ctx.drawImage('/images/icons/bird.png', col * w, row * w, w, w)
      ctx.draw()
    },
  ```

  - 在 `game.js`的 `Onload` 函数中创建画布上下文，并依次调用上面自定义的两个函数。

  - 创建小鸟**上下左右移动**的四个函数，下文代码给出一个方向，其余同理：

    ```js
    up: function () {
        if (row > 0) {
          if (map[row - 1][col] != 1 && box[row - 1][col] != 4) {
            row = row - 1
          } else if (box[row - 1][col] == 4) {
            if (row - 1 > 0) {
              if (map[row - 2][col] != 1 && box[row - 2][col] != 4) {
                box[row - 2][col] = 4
                box[row - 1][col] = 0
                row = row - 1
              }
            }
          }
          this.drawCanvas()
          this.checkWin()
        }
      },
    ```

  - 在`game.js`文件中添加自定义函数`isWin`，用于**判断游戏是否已经成功**。判断逻辑是只要有一个箱子没有在终点位置就判断游戏尚未成功。然后在`game.js`中添加自定义函数`checkWin`，要求一旦**游戏成功就弹出提示对话框**。最后在`game.js`的4个方向键函数中**追加**关于游戏成功判断的函数。代码如下：

    ```js
    /**
       * 判断是否胜利：所有箱子都在目标点上（箱子层=4 且 地图层=3）
       */
      isWin: function () {
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            if (box[i][j] == 4 && map[i][j] != 3) {
              return false
            }
          }
        }
        return true
      },
    
      /**
       * 胜利弹窗
       */
      checkWin: function () {
        if (this.isWin()) {
          wx.showModal({
            title: '恭喜',
            content: '游戏成功',
            showCancel: false
          })
        }
      },
    ```

  - 最后制作一个至此游戏**重启**的函数：

    ```js
      restartGame: function () {
        this.initMap(this.data.level - 1)
        this.drawCanvas()
      }
    ```

    

- <span style="color:#7D7DDE; font-weight:bold">修改结构文件</span>

  - 修改 `game.wxml`页面中的4个方向键`<button>`，为其绑定点击事件。
  - **修改代码**如下：

```html
 <view class="btnBox">
    <button type="warn" bind:tap="up">↑</button>
    <view>
      <button type="warn" bind:tap="left">←</button>
      <button type="warn" bind:tap="down">↓</button>
      <button type="warn" bind:tap="right">→</button>
    </view>
  </view>
```



## 三、程序运行结果

成功实现首页与游戏界面的展示、跳转、操作、提示。

## 四、问题总结与体会

### 4.1 问题总结

- **逻辑实现难点**
  - **问题**：在实现人物推动箱子的逻辑时，需要同时判断“前方是否有墙”“是否存在箱子”以及“箱子是否能继续前进”，写了半天没写对。
  - **解决方法**：通过分层存储地图数据和箱子数据，分别判断障碍物与箱子的状态，并在推动时更新两个数据结构，保证逻辑清晰正确。
- **胜利条件判定**
  - **问题**：在实现 `isWin` 函数时，最初只要有一个箱子到达目标点就会触发胜利，导致提前判定成功。
  - **解决方法**：改为遍历整个地图，逐一检查所有箱子是否都在目标点位置，只有全部满足条件时才判定胜利。

### 4.2 体会

本次实验让我认识到**模块化开发的价值**。把地图数据单独放在 `utils/data.js` 中后，感觉逻辑代码和数据有了清晰的分工，修改和扩展都更方便。如果以后要增加新关卡，只需要在数据文件里添加内容，而不用改动核心逻辑，这减少了出错的机会。同时，我也体会到前端开发本身就是一种模块化的思路：页面由结构、样式和逻辑组成，每一部分相对独立又能组合在一起。把这种理念应用到游戏中，不仅能让项目结构更清晰，更能调试和维护的效率。
