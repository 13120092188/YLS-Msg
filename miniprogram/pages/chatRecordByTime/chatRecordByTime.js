// miniprogram/pages/chatRecordByTime/chatRecordByTime.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    messages: [],
    counter: 0,
    userInfo: 0,
    isPullDown: false,
    firstLoad:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecords2()
    // this.getRecordsByTime()
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
      counter: 0,
      userInfo: 0,
      isPullDown: false,
      firstLoad: false
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (this.data.counter > 2 || (this.data.isPullDown && this.data.counter >= 0)) {
      // 显示顶部刷新图标
      wx.showNavigationBarLoading();

      if (!this.data.firstLoad) {
        this.getRecords3()
      }else{
        this.getRecords1()
      }
      
      wx.pageScrollTo({
        scrollTop: 10,
        duration: 3
      })

      this.data.isPullDown = true
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
    } else {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.firstLoad) {
      this.data.counter++
      console.log(this.data.counter)
      this.getRecords()
    } else {
      console.log(this.data.counter)
      this.getRecords()
    }
    
    this.data.isPullDown = false
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 获取一组聊天记录
  getRecords2: function () {
    //调用云函数读取message数据
    var that = this
    wx.cloud.callFunction({
      name: 'readMsgWhere',
      data: {
        collectionName: "messages",
        timeStringDate: app.globalData.timeStringDate
      },
      success: res => {
        console.log("11111111111")
        that.data.number = res.result.data[0].number
        that.data.counter = parseInt(that.data.number/100)
        console.log(that.data.counter)

        wx.cloud.callFunction({
          name: 'readMsgByTime',
          data: {
            collectionName: "messages",
            number: that.data.number
          },
          success: res => {
            console.log("2222222222")
            var temp = res.result.data
            that.setData({
              messages: that.data.messages.concat(temp)
            })
            console.log('ByTime', that.data.messages)
            
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '调用失败',
            })
            console.error('[云函数] [readMsgByTime] 调用失败：', err)
          }
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [readMsgWhere] 调用失败：', err)
      }
    })
  },

  // 获取一组聊天记录
  getRecords1: function () {
    if (!this.data.isPullDown && this.data.firstLoad) {
      this.data.counter -= 3
    }
    console.log(this.data.counter)
    //调用云函数读取message数据
    var that = this
    wx.cloud.callFunction({
      name: 'readMsg',
      data: {
        i: that.data.counter,
        collectionName: "messages",
        order: 'asc'
      },
      success: res => {
        var temp = res.result.data
        that.setData({
          messages: temp.concat(that.data.messages).slice(0, 200)
        })
        console.log('下拉', that.data.messages)
        that.data.counter--
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [readMsg] 调用失败：', err)
      }
    })
    that.data.firstLoad = true
  },

  // 获取一组聊天记录
  getRecords3: function () {
    console.log(this.data.counter)
    //调用云函数读取message数据
    var that = this
    wx.cloud.callFunction({
      name: 'readMsg',
      data: {
        i: that.data.counter,
        collectionName: "messages",
        order: 'asc'
      },
      success: res => {
        var temp = res.result.data
        that.setData({
          messages: temp.concat(that.data.messages).slice(0, 200)
        })
        console.log('下拉', that.data.messages)
        that.data.counter--

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

  // 获取一组聊天记录
  getRecords: function () {
    if (this.data.isPullDown && this.data.firstLoad) {
      this.data.counter += 3
    }
    //调用云函数读取message数据
    var that = this
    wx.cloud.callFunction({
      name: 'readMsg',
      data: {
        i: that.data.counter,
        collectionName: "messages",
        order: 'asc'
      },
      success: res => {
        if (that.data.counter >= 2 || (that.data.counter == 1 && that.data.isPullDown)) {
          var temp = res.result.data
          that.setData({
            messages: that.data.messages.concat(temp).slice(100, 300)
          })
          console.log('上拉1', that.data.messages)
        } else {
          var temp = res.result.data
          that.setData({
            messages: that.data.messages.concat(temp)
          })
          console.log('上拉2', that.data.messages)
        }
        that.data.counter++
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [readMsg] 调用失败：', err)
      }
    })
    that.data.firstLoad = true
  }
})