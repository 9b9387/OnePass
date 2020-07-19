// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID;
    const { service } = event;

    return await db.collection('configs')
        .where({
            _openid: openid,
            service: service
        })
        .limit(1)
        .get()
}