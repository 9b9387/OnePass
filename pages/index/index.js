//index.js
//获取应用实例
var Vault = require("vault");

class PassConfig {
  service = ""
  length= 8
  isUpper= true
  isLower= true
  isNumber= true
  isSymbol= true
}

Page({
  data: {
    password: "",
    lengthList: [6, 8, 10, 12, 16, 24, 32],
    lengthIndex: 1,
    serviceList: [],
    serviceIndex: -1,
    serviceLoaded: false,
    isUpper: true,
    isLower: true,
    isNumber: true,
    isSymbol: true,
    actionType: 0 // 0: none, 1: history 2:delete 3:update 4:save
  },

  service: "",
  passphrase: "",
  currentConfig: null,

  onLoad: function () {
    // var serviceList = new Set();
    // serviceList.add("test1")
    // serviceList.add("test2")

    // var json = JSON.stringify(Array.from(new Set(serviceList)));
    // console.log(json);

    // this.saveHistory(Array.from(new Set(serviceList)))
    // this.loadHistory();
    // var set = new Set(this.data.serviceList);
    // set.add("test1")
    // set.add("test2")
    // this.saveHistory(Array.from(set))

    // var c1 = new PassConfig();
    // c1.length = 24;
    // c1.isUpper = false;
    // c1.isLower = false;
    // c1.isNumber = false;
    // c1.isSymbol = false;
    // c1.service = "test1";
    // this.saveServiceConfig("test1", c1)

    // var c2 = new PassConfig();
    // c2.length = 32;
    // c2.service = "test2";
    // this.saveServiceConfig("test2", c2)

    this.loadHistory();
  },
 
  onServiceInput : function(e) {
    console.log(e.detail.value);
    this.service = e.detail.value
    this.checkAction()
  },

  onPassphraseInput: function(e) {
    this.passphrase = e.detail.value;
    this.generatePassword();    
  },

  generatePassword: function() {
    var v = new Vault({
      phrase: this.passphrase,
      lower: this.data.isLower ? 1 : 0,
      upper: this.data.isUpper ? 1 : 0,
      space: 0,
      dash: this.data.isSymbol ? 1 : 0,
      symbol: this.data.isSymbol ? 1 : 0,
      number: this.data.isNumber ? 1 : 0,
      length: this.data.lengthList[this.data.lengthIndex]
    });
    var password = ""
    try {
      password = v.generate(this.service)
    } catch (error) {
      console.log(error)
    }

    this.setData({
      password: password
    });
  },

  onClickDelete: function(e)
  {
    this.removeServiceConfig(this.service);
    this.loadHistory();

    this.setData({
      serviceIndex: -1
    })
  },

  onClickUpdate: function(e)
  {
    var config = new PassConfig();
    config.service = this.service;
    config.isLower = this.data.isLower;
    config.isUpper = this.data.isUpper;
    config.isNumber = this.data.isNumber;
    config.isSymbol = this.data.isSymbol;
    config.length = this.data.lengthList[this.data.lengthIndex];

    this.saveServiceConfig(this.service, config);
    this.loadServiceConfig(this.service);
  },

  onClickCopyPassword: function(e)
  {
    wx.setClipboardData({
      data: this.password,
    })

    var set = new Set(this.data.serviceList);
    set.add(this.service);
    this.saveHistory(Array.from(set))

    this.onClickUpdate();

    this.loadHistory();
  },

  onClickHistory: function(e) {
    console.log(e);
    var index = e.detail.value;
    var service = this.data.serviceList[index];
    this.loadServiceConfig(service);
    this.setData({
      serviceIndex: index,
      actionType : 2,
    })
    this.generatePassword();
    this.checkAction();  
  },

  onSwitchSymbol: function(e) {
    console.log(e)
    var isChecked = e.detail.value;
    this.setData({
      isSymbol: isChecked
    })
    this.generatePassword();
    this.checkAction();   
  },

  onSwitchLower: function(e) {
    console.log(e)
    var isChecked = e.detail.value;
    this.setData({
      isLower: isChecked
    })
    this.generatePassword();
    this.checkAction();  
  },

  onSwitchUpper: function(e) {
    console.log(e)
    var isChecked = e.detail.value;
    this.setData({
      isUpper: isChecked
    })
    this.generatePassword();  
    this.checkAction();  
  },

  onSwitchNumber: function(e) {
    console.log(e)
    var isChecked = e.detail.value;
    this.setData({
      isNumber: isChecked
    })
    this.generatePassword();
    this.checkAction();    
  },

  onClickLength: function(e) {
    console.log(e);
    var index = e.detail.value;
    this.setData(
      {lengthIndex: index}
    )
    this.generatePassword();
    this.checkAction();    
  },

  checkAction: function()
  {
    console.log("checkAction");
    if(this.currentConfig == null)
    {
      console.log("currentConfig is null");
      this.setData({
        actionType: 1,
      })
      return;
    }
    console.log(this.currentConfig);

    console.log(this.service, this.currentConfig.service)
    if(this.service != this.currentConfig.service)
    {
      this.setData({
        actionType: 1,
      })
      return;
    }

    if(this.data.isUpper == this.currentConfig.isUpper
      && this.data.isLower == this.currentConfig.isLower
      && this.data.isNumber == this.currentConfig.isNumber
      && this.data.isSymbol == this.currentConfig.isSymbol
      && this.data.lengthList[this.data.lengthIndex] == this.currentConfig.length)
    {
      this.setData({
        actionType: 2,
      })
    }
    else
    {
      this.setData({
        actionType: 3,
      })
    }
  },

  loadServiceConfig: function(service)
  {
    console.log("loadServiceConfig", service);
    var self = this;
    wx.getStorage({
      key: service,
      success (res) {
        console.log("success:", res.data);
        var config = JSON.parse(res.data);
        var index = self.data.lengthList.indexOf(config.length);
        self.setData({
          isUpper: config.isUpper,
          isLower: config.isLower,
          isNumber: config.isLower,
          isSymbol: config.isSymbol,
          lengthIndex: index
        })
        self.currentConfig = config;
        self.service = config.service;
        self.generatePassword();
        self.checkAction();
      },
      fail (res) {
        console.log("fail:",res);
      }
    })
  },

  saveServiceConfig: function(service, config)
  {
    var json = JSON.stringify(config);
    console.log(service, json)
    wx.setStorage({
      data: json,
      key: service,
    })
  },

  removeServiceConfig: function(service)
  {
    wx.removeStorage({
      key: this.service,
    })

    var set = new Set(this.data.serviceList);
    set.delete(this.service);
    this.saveHistory(Array.from(set))
  },

  loadHistory: function()
  {
    var self = this;
    wx.getStorage({
      key: 'list',
      success (res) {
        self.setData({
          serviceList: JSON.parse(res.data),
          actionType: 1,
        })
      },
    })
  },

  saveHistory: function(list)
  {
    var json = JSON.stringify(list);
    wx.setStorage({
      data: json,
      key: 'list',
    })
  }
})


