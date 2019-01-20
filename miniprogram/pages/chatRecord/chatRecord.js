// miniprogram/pages/myTest/myTest.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: './user-unlogin.png',
    messages: [],
    temp: [],
    counter:0,
    userInfo:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取用户信息
    // this.getUserInfo()
    //调用云函数读取message数据
    wx.cloud.callFunction({
      name: 'readMsg',
      data: {
        i: this.data.counter,
        collectionName:"messages1",
        order:'asc'
      },
      success: res => {
        // wx.showToast({
        //   title: '调用成功',
        // })
        this.setData({
          messages: res.result.data
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [readMsg] 调用失败：', err)
      }
    })
    this.data.counter++
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      messages: [],
      temp: [],
      counter: 0
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //调用云函数读取message数据
    wx.cloud.callFunction({
      name: 'readMsg',
      data: {
        i: this.data.counter,
        collectionName: "messages1",
        order:'asc'
      },
      success: res => {
        // wx.showToast({
        //   title: '调用成功',
        // })
        this.setData({
          temp: res.result.data
        })
        console.log(this.data.temp)
        this.setData({
          messages: this.data.messages.concat(this.data.temp)
        })
        console.log(this.data.messages)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [readMsg] 调用失败：', err)
      }
    })
    this.data.counter++
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 获取用户信息
  // getUserInfo: function () {
  //   var that = this
  //   _getUserInfo();
  //   function _getUserInfo() {
  //     wx.getUserInfo({
  //       success: function (res) {
  //         that.setData({
  //           userInfo: res.userInfo
  //         })
  //       }
  //     })
  //   }
  // }
})