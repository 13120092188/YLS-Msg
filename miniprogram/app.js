//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    //调用云函数获取用户信息
    wx.cloud.callFunction({
      name: 'getInfo',
      complete: res => {
        if (res.result.openid == 'oz3oN5HrG7HyxDrD2sDFVZXUHXZY') {
          this.globalData.nameCode = 1
        } else if (res.result.openid == 'oz3oN5Mitki-JSWCibVe-tB8fzGY') {
          this.globalData.nameCode = 2
        } else {
          this.globalData.nameCode = 3
        }
        this.globalData.myOpenId = res.result.openid
      }
    })

    // //调用云函数获取globalData
    // wx.cloud.callFunction({
    //   name: 'getGlobalData',
    //   complete: res => {
    //     this.globalData.numberOfSweetWords = res.result.numberOfSweetWords
    //     this.globalData.numberOfImage = res.result.numberOfImage
    //     console.log(res.result)
    //   }
    // })

    // //获取数据库变量
    // const db = wx.cloud.database()
    // var that = this
    // db.collection('globalDatas').doc('XD3oO3ffS3SWu3S3').get({
    //   success(res) {
    //     // res.data 包含该记录的数据
    //     that.globalData.numberOfSweetWords = res.data.count
    //   }
    // })
    // db.collection('globalDatas').doc('XD3oZ8DR1TiNkdp5').get({
    //   success(res) {
    //     // res.data 包含该记录的数据
    //     that.globalData.numberOfImage = res.data.count
    //   }
    // })
    
    //调用云函数读取message数据
    var that = this
    wx.cloud.callFunction({
      name: 'readMsg',
      data: {
        i: 0,
        collectionName: "globalDatas",
        order: 'asc'
      },
      success: res => {
        that.globalData.numberOfSweetWords = res.result.data[0].count
        that.globalData.numberOfImage = res.result.data[1].count
        console.log(res.result.data[0].count)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [readMsg] 调用失败：', err)
      }
    })
    this.globalData = {}
  },
  globalData:{
    nameCode:0,
    myOpenId:'',
    numberOfSweetWords:0,
    numberOfImage:0,
    timeStringDate:''
  }
})
