class DataManager {

    static config_prefix = "service_name_"

    static load_service_list(success, fail)
    {
        wx.getStorageInfo({
            success: res => {
                var keys = new Array();
                res.keys.forEach(key => {
                    if(key.startsWith(this.config_prefix))
                    {
                        keys.push(key.replace(this.config_prefix, ""))
                    }
                });
                
                success(keys);
            },
            fail: fail
        })
    }

    static save_service(config, success, fail)
    {
        wx.setStorage({
            key: this.config_prefix.concat(config.service),
            data: JSON.stringify(config),
            success: success,
            fail: fail
        });
    }

    static load_service(key)
    {
        let service_name = this.config_prefix.concat(key);
        return wx.getStorageSync(service_name);
    }

    static remove_service(key, success, fail)
    {
        let service_name = this.config_prefix.concat(key);
        wx.removeStorage({
            key: service_name,
            success: success,
            fail: fail
        })
    }

    static save_passphrase(passphrase)
    {
        wx.setStorageSync('passphrase', passphrase)
    }

    static remove_passphrase()
    {
        wx.removeStorageSync('passphrase')
    }

    static load_passphrase()
    {
        return wx.getStorageSync('passphrase')
    }
}

module.exports = {
    DataManager: DataManager
}