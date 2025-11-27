// pages/index/index.js
Page({
  data: {
    src: '/images/logo.png',   // 项目根目录 images/logo.png
    name: 'Hello World',       // 初始占位
    canIUseGetUserProfile: false
  },
  onLoad() {
    this.setData({ canIUseGetUserProfile: !!wx.getUserProfile })
  },
  // 点击按钮、拉起授权、更新头像昵称
  getMyInfo() {
    if (!wx.getUserProfile) {
      wx.showToast({ title: '基础库过低，无法获取用户信息', icon: 'none' })
      return
    }
    wx.getUserProfile({
      desc: '展示用户信息',
      success: (res) => {
        this.setData({
          src: res.userInfo.avatarUrl,
          name: res.userInfo.nickName
        })
      },
      fail: () => {
        wx.showToast({ title: '已取消授权', icon: 'none' })
      }
    })
  }
})
