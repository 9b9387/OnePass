// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let { service } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID;

  return await db.collection('configs')
    .where({
      _openid: openid,
      service: service
    })
    .remove();
}