const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  // 先取出集合记录总数
  // const countResult = await db.collection(event.collectionName).where({ number: _.gt(100).and(_.lt(200))}).count()
  // const total = countResult.total
  // // 计算需分几次取
  // const batchTimes = Math.ceil(total / 100)
  // // 承载所有读操作的 promise 的数组
  number = 0 
  db.collection(event.collectionName).where({ timeString: '2018-08-10 09:17:47' }).get({
    success(res) {
      // res.data 包含该记录的数据
      console.log(res.data)
      number = res.data[0].number
    }
  })
  // number = 101
  const tasks = []
  // for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection(event.collectionName).skip(number-1).limit(MAX_LIMIT).get()
    tasks.push(promise)
  // }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => ({
    data: acc.data.concat(cur.data),
    errMsg: acc.errMsg,
  }))
}