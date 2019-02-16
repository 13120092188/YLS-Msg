const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  
  const tasks = []
  const promise = db.collection(event.collectionName).where({
    timeStringDate: event.timeStringDate
  }).get()
  tasks.push(promise)
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => ({
    data: acc.data.concat(cur.data),
    errMsg: acc.errMsg,
  }))
}