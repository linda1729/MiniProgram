// 若你的关卡数据存放在单独的 data.js 中，请按实际路径调整：
// data.maps = [map1, map2, map3, map4] （从 0 开始索引）
const data = require('../../utils/data.js')  // ← 按需改路径

// 方块像素宽度
var w = 40
// 主角（小鸟）坐标
var row = 0
var col = 0

Page({
  /**
   * 页面的初始数据
   */
  data: {
    level: 1
  },

  /**
   * 初始化关卡到 map/box，并设置主角位置
   */
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

  /**
   * 生命周期函数——页面加载
   * 传入的 options.level 建议是字符串形式的 0/1/2/3（从 0 开始）
   */
  onLoad(options) {
    let level = parseInt(options.level || '0', 10)

    // 页面上显示的人类友好编号（1 开始）
    this.setData({ level: level + 1 })

    // 绑定 canvas 上下文
    this.ctx = wx.createCanvasContext('myCanvas')

    // 初始化并绘制
    this.initMap(level)
    this.drawCanvas()
  },

  /**
   * 方向键：上
   */
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

  /**
   * 方向键：下
   */
  down: function () {
    if (row < 7) {
      if (map[row + 1][col] != 1 && box[row + 1][col] != 4) {
        row = row + 1
      } else if (box[row + 1][col] == 4) {
        if (row + 1 < 7) {
          if (map[row + 2][col] != 1 && box[row + 2][col] != 4) {
            box[row + 2][col] = 4
            box[row + 1][col] = 0
            row = row + 1
          }
        }
      }
      this.drawCanvas()
      this.checkWin()
    }
  },

  /**
   * 方向键：左
   */
  left: function () {
    if (col > 0) {
      if (map[row][col - 1] != 1 && box[row][col - 1] != 4) {
        col = col - 1
      } else if (box[row][col - 1] == 4) {
        if (col - 1 > 0) {
          if (map[row][col - 2] != 1 && box[row][col - 2] != 4) {
            box[row][col - 2] = 4
            box[row][col - 1] = 0
            col = col - 1
          }
        }
      }
      this.drawCanvas()
      this.checkWin()
    }
  },

  /**
   * 方向键：右
   */
  right: function () {
    if (col < 7) {
      if (map[row][col + 1] != 1 && box[row][col + 1] != 4) {
        col = col + 1
      } else if (box[row][col + 1] == 4) {
        if (col + 1 < 7) {
          if (map[row][col + 2] != 1 && box[row][col + 2] != 4) {
            box[row][col + 2] = 4
            box[row][col + 1] = 0
            col = col + 1
          }
        }
      }
      this.drawCanvas()
      this.checkWin()
    }
  },

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

  restartGame: function () {
    this.initMap(this.data.level - 1)
    this.drawCanvas()
  }

})

// 地图图层数据
var map = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
]

// 箱子图层数据
var box = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
]

// 方块的宽度
var w = 40

// 初始化游戏主角(小鸟)的行与列
var row = 0
var col = 0