// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var num = event.number
  var itemId = event.itemId
  try {
    return await db.collection('globalDatas').doc(itemId).update({
        data: {
          count: num
        },
      }).then(res => {
        console.log(res)
      })
  } catch (e) {
    console.error(e)
  }
}