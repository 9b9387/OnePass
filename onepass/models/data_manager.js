class DataManager {
    static load_service_list(success, fail)
    {
      wx.getStorageInfo({
        success: res => {
          var keys = new Array();
          res.keys.forEach(key => {
            if(key.startsWith("service_name_"))
            {
              keys.push(key.replace("service_name_", ""))
            }
          });
          success(keys);
        },
        fail: fail
      })
    }

    static save_service(config, success, fail)
    {
      console.log(JSON.stringify(config))
      let prefix = "service_name_";
      wx.setStorage({
        key: prefix.concat(config.service),
        data: JSON.stringify(config),
        success: success,
        fail: fail
      });
    }

    static load_service(key, success, fail)
    {
      let prefix = "service_name_";
      let service_name = prefix.concat(key);
      console.log("load", service_name)
      wx.getStorage({
        key: service_name,
        success: success,
        fail: fail
      })
    }

    static remove_service(key, success, fail)
    {
      let prefix = "service_name_";
      let service_name = prefix.concat(key);
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