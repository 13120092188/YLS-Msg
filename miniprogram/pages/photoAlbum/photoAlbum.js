// miniprogram/pages/photoAlbum/photoAlbum.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagePaths:[],
    myOpenId:app.globalData.myOpenId,
    counter:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //调用云函数读取message数据
    wx.cloud.callFunction({
      name: 'readMsg',
      data: {
        i: this.data.counter,
        collectionName: "imageInfos",
        order: 'desc'
      },
      success: res => {
        // wx.showToast({
        //   title: '调用成功',
        // })
        this.setData({
          imagePaths: res.result.data
        })
        console.log(this.data.imagePaths)
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

  // 上传图片
  doUploadImg: function () {
    var that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        console.log(res)

        // 上传图片
        const cloudPath = 'Images/uploadImg/cute-image' + app.globalData.numberOfImage + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            // app.globalData.fileID = res.fileID
            // app.globalData.cloudPath = cloudPath
            // app.globalData.imagePath = filePath

            var res_ = res
            //上传云数据库sweetwords数据
            var nowTime = new Date()
            const db = wx.cloud.database()
            db.collection('imageInfos').add({
              data: {
                num: app.globalData.numberOfImage,
                fileID: res_.fileID,
                time: nowTime,
                timeString:nowTime.toLocaleString(),
                cloudPath: cloudPath,
                tempImagePath: filePath
              },
              success: res => {
                //更新列表数据
                that.data.imagePaths.unshift({ "_id": res._id, "_openid": that.data.myOpenId, "number": app.globalData.numberOfImage, "fileID": res_.fileID, "time": nowTime,"timeString":nowTime.toLocaleString(), "cloudPath": cloudPath,"tempImagePath":filePath })
                console.log(that.data.imagePaths)
                that.setData({
                  imagePaths: that.data.imagePaths
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
            app.globalData.numberOfImage = app.globalData.numberOfImage + 1
            console.log(app.globalData.numberOfImage)/////////////////////
            db.collection('globalDatas').doc('XD3oZ8DR1TiNkdp5').update({
              data: {
                count: app.globalData.numberOfImage
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

            // wx.navigateTo({
            //   url: '../storageConsole/storageConsole'
            // })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  }
})