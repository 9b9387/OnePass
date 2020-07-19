// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID;

    // 先取出集合记录总数
    const countResult = await db.collection('configs')
        .where({
            _openid: openid
        })
        .count()
    const total = countResult.total

    if (total == 0) {
        return {
            data: [],
            errMsg: "ok",
        }
    }

    // 计算需分几次取
    const batchTimes = Math.ceil(total / MAX_LIMIT)

    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
        const promise = db.collection('configs')
            .where({
                _openid: openid
            })
            .skip(i * MAX_LIMIT)
            .limit(MAX_LIMIT)
            .field({
                service: true
            })
            .get()
        tasks.push(promise)
    }

    // 等待所有
    return (await Promise.all(tasks))
        .reduce((acc, cur) => {
            return {
                data: acc.data.concat(cur.data),
                errMsg: acc.errMsg,
            }
        })
}