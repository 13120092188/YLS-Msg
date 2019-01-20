// miniprogram/pages/sweetWords/sweetWords.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sweetWordss:[],
    sendWords:'',
    nameCode:0,
    myOpenId:'',
    counter:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      nameCode: app.globalData.nameCode,
      myOpenId: app.globalData.myOpenId
    })
    //调用云函数读取message数据
    wx.cloud.callFunction({
      name: 'readMsg',
      data: {
        i: this.data.counter,
        collectionName: "sweetWordss",
        order:'desc'
      },
      success: res => {
        // wx.showToast({
        //   title: '调用成功',
        // })
        this.setData({
          sweetWordss: res.result.data
        })
        console.log(this.data.sweetWordss)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [readMsg] 调用失败：', err)
      }
    })
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
      sweetWordss: [],
      sendWords: '',
      nameCode: 0,
      myOpenId: ''
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  sendSweetWords: function() {
    if(this.data.sendWords != ''){
      //上传云数据库sweetwords数据
      const db = wx.cloud.database()
      var nowTime = new Date()
      db.collection('sweetWordss').add({
        data: {
          words: this.data.sendWords,
          time: nowTime,
          timeString: nowTime.toLocaleString(),
          num: app.globalData.numberOfSweetWords
        },
        success: res => {
          //更新列表数据
          this.data.sweetWordss.unshift({ "_id": res._id, "_openid": this.data.myOpenId, "time": nowTime, "timeString": nowTime.toLocaleString(), "words": this.data.sendWords , "number":app.globalData.numberOfSweetWords})
          console.log(this.data.sweetWordss)
          this.setData({
            sweetWordss: this.data.sweetWordss,
            //清空文本框内容
            sendWords: ''
          })
          wx.showToast({
            title: '发送成功',
          })
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })

      //更新云数据库中变量的值
      app.globalData.numberOfSweetWords = app.globalData.numberOfSweetWords + 1
      console.log(app.globalData.numberOfSweetWords)
      db.collection('globalDatas').doc('XD3oO3ffS3SWu3S3').update({
        data: {
          count: app.globalData.numberOfSweetWords
        },
        success: res => {
          this.setData({
            // count: newCount
          })
        },
        fail: err => {
          icon: 'none',
            console.error('[数据库] [更新记录] 失败：', err)
        }
      })
    }
    
  },
  getSweetWords: function(e) {
    var val = e.detail.value;
    this.setData({
      sendWords: val
    });
  } 
})