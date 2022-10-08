// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    let {
        config
    } = event
    let {
        OPENID
    } = cloud.getWXContext() // 这里获取到的 openId 和 appId 是可信的

    try {
        let count = await db.collection('configs')
            .where({
                _openid: OPENID,
                service: config.service
            })
            .count();

        if (count.total > 0) {
            return {
                errCode: -1,
                errMsg: config.service + " already exist.",
            };
        }

        let res = await db.collection('configs').add({
            data: {
                _openid: OPENID,
                service: config.service,
                length: config.length,
                include_alpha: config.include_alpha,
                include_number: config.include_number,
                include_symbol: config.include_symbol,
            }
        })
        return {
            config: config,
            errCode: 0,
            errMsg: "ok",
        };
    } catch (e) {
        console.error(e)
    }
}