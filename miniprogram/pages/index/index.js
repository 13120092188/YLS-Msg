// miniprogram/pages/index/index.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nameCode:0,
    sweetWords:'',
    list: [
      {
        id: 'chatRecord',
        name: '聊天记录',
        icon_url: 'https://796c-yls1-cc55f1-1258517682.tcb.qcloud.la/Images/Icon/icon_chatRecord.png?sign=d5757d72ee918d461bc4d4197c608ab1&t=1547705699'
      },
      {
        id: 'sweetWords',
        name: '说点什么',
        icon_url: 'https://796c-yls1-cc55f1-1258517682.tcb.qcloud.la/Images/Icon/icon_love.png?sign=0c61edd6043ae0ef7816920278316a45&t=1547709685'
      },
      {
        id: 'photoAlbum',
        name: '小可爱的相册',
        icon_url: 'https://796c-yls1-cc55f1-1258517682.tcb.qcloud.la/Images/Icon/icon_album.png?sign=6cb5a90b605077fc1788a09f4b963536&t=1547800215'
      },
      {
        id: 'memoryForYou',
        name: '小可爱的脑子',
        icon_url: 'https://796c-yls1-cc55f1-1258517682.tcb.qcloud.la/Images/Icon/icon_memory.png?sign=2cf29f548aac2858e42e949d65b14c6b&t=1547800789'
      },
      {
        id: 'index1',
        name: '尚待开发',
        icon_url: 'https://796c-yls1-cc55f1-1258517682.tcb.qcloud.la/Images/Icon/icon_naughty.png?sign=e010f2bba6a9b7671302123feb171caf&t=1547800943'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    setTimeout(function () {
      that.setData({
        nameCode:app.globalData.nameCode
      })
      that.getSweetWords()
    }, 2000)

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 获取用户信息
  getSweetWords: function () {
    var random = Math.floor(Math.random() * app.globalData.numberOfSweetWords)
    console.log(random)
    // var that = this
    // const db = wx.cloud.database()
    // db.collection('sweetWordss').where({
    //   num: 14
    // }).get({
    //     success(res) {
    //       // res.data 是包含以上定义的两条记录的数组
    //       console.log(res.data)
    //       that.setData({
    //         sweetWords:res.data[0].words
    //       })
    //     }
    //   })

    //调用云函数读取message数据
    var that = this
    wx.cloud.callFunction({
      name: 'readMsg',
      data: {
        i: 0,
        collectionName: "sweetWordss",
        order: 'asc'
      },
      success: res => {
        that.setData({
          sweetWords: res.result.data[random].words
        })
        console.log(res.result.data[0].words)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [readMsg] 调用失败：', err)
      }
    })
  }

  
})