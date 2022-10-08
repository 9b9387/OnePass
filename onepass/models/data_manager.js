class DataManager {
    constructor() 
    {
      // wx.getStorage({
      //   key: "config",
      //   success: (res) => {
      //     console.log(res.data);
      //   }
      // })
    }

    load_service_list(success, fail)
    {
        // wx.cloud.callFunction({
        //     name: 'load_service_list',
        //     success: res => {
        //         console.log("load_service_list success:", res);
        //         success(res);
        //     },
        //     fail: err => {
        //         console.error(err);
        //         fail(err);
        //     }
        // })
    }

    save_service(config, success, fail)
    {
        // wx.cloud.callFunction({
        //     name: 'save_service',
        //     data: {
        //         config: config,
        //     },
        //     success: res => {
        //         console.log("save_service success:", res);
        //         if(success != null)
        //         {
        //             success(res);
        //         }
        //     },
        //     fail: err => {
        //         console.error(err)
        //         if(fail != null)
        //         {
        //             fail(err);
        //         }
        //     }
        // })
    }

    load_service(service, success, fail)
    {
        // wx.cloud.callFunction({
        //     name: 'load_service',
        //     data: {
        //         service: service,
        //     },
        //     success: res => {
        //         console.log("load_service success:", res);
        //         if(success != null)
        //         {
        //             success(res);
        //         }
        //     },
        //     fail: err => {
        //         console.error(err)
        //         if(fail != null)
        //         {
        //             fail(err);
        //         }
        //     }
        // })
    }

    remove_service(service, success, fail)
    {
        // wx.cloud.callFunction({
        //     name: 'remove_service',
        //     data: {
        //         service: service,
        //     },
        //     success: res => {
        //         console.log("remove_service success:", res);
        //         if(success != null)
        //         {
        //             success(res);
        //         }
        //     },
        //     fail: err => {
        //         console.error(err)
        //         if(fail != null)
        //         {
        //             fail(err);
        //         }
        //     }
        // })
    }

    save_passphrase(passphrase)
    {
        wx.setStorageSync('passphrase', passphrase)
    }

    remove_passphrase()
    {
        wx.removeStorageSync('passphrase')
    }

    load_passphrase()
    {
        return wx.getStorageSync('passphrase')
    }
}

module.exports = {
    DataManager: DataManager
  }