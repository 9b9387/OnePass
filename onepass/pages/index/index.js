//index.js
//获取应用实例
var Vault = require("../../vault/vault");
import { PassConfig } from '../../models/passconfig'
import { ServiceList } from '../../models/servicelist'

Page({
  data: {
    password: "",
    lengthList: [6, 8, 10, 12, 16, 24, 32],
    serviceRange: [],
    serviceLoaded: false,
    config: new PassConfig(),
    actionType: 0, // 0: none, 1: history 2:delete 3:update 4:save
    showOptions: false,
  },

  passphrase: "",
  config0: null,
  serviceList: new ServiceList(),

  onLoad: function () {
    this.serviceList.load();
    this.updateAction()

    this.setData({
      serviceRange : this.serviceList.list
    })
  },
 
  onServiceInput : function(e) {
    this.data.config.service = e.detail.value
    this.checkServiceInput();
    this.refreshView();
  },

  onPassphraseInput: function(e) {
    this.passphrase = e.detail.value;
    this.generatePassword();    
  },

  generatePassword: function() {
    if(this.passphrase == "" || this.data.config.service == "")
    {
      this.password = ""
      this.setData({
        password: this.password
      });
      return;
    }
    var v = new Vault({
      phrase: this.passphrase,
      lower: this.data.config.isLower ? 1 : 0,
      upper: this.data.config.isUpper ? 1 : 0,
      space: 0,
      dash: this.data.config.isSymbol ? 1 : 0,
      symbol: this.data.config.isSymbol ? 1 : 0,
      number: this.data.config.isNumber ? 1 : 0,
      length: this.data.config.length
    });
    this.password = ""
    try {
      this.password = v.generate(this.data.config.service)
    } catch (error) {
      console.log(error)
    }

    this.setData({
      password: this.password
    });
  },

  onClickDelete: function(e)
  {
    this.serviceList.remove(this.data.config.service);
    this.data.config.remove();
    this.data.config.reset();
    this.config0 = null;

    this.setData({
      config: this.data.config,
      serviceRange: this.serviceList.list
    })
    this.refreshView();
  },

  onClickUpdate: function(e)
  {
    this.data.config.save();
    if(this.config0 == null)
    {
      this.config0 = new PassConfig();
    } 
    this.config0.clone(this.data.config);
    this.updateAction();  
  },

  onClickCopyPassword: function(e)
  {
    wx.setClipboardData({
      data: this.password,
    })
    
    this.data.config.save();
    if(this.config0 == null)
    {
      this.config0 = new PassConfig();
    }
    this.config0.clone(this.data.config);

    this.serviceList.add(this.data.config.service);
    this.setData({
      serviceRange: this.serviceList.list
    })

    this.updateAction()
  },

  onClickHistory: function(e) {
    var index = e.detail.value;
    var service = this.serviceList.list[index];
    var c = new PassConfig();
    c.load(service);
    c.service = service;
    if(this.config0 == null)
    {
      this.config0 = new PassConfig();
    }
    this.config0.clone(c);

    this.setData({
      config: c,
    })

    this.refreshView();
  },

  onSwitchSymbol: function(e) {
    var isChecked = e.detail.value;
    var c = new PassConfig();
    c.clone(this.data.config);
    c.isSymbol = isChecked;

    this.setData({
      config: c,
    })
    this.refreshView();
  },

  onSwitchLower: function(e) {
    var isChecked = e.detail.value;
    var c = new PassConfig();
    c.clone(this.data.config);
    c.isLower = isChecked;

    this.setData({
      config: c,
    })
    this.refreshView();
  },

  onSwitchUpper: function(e) {
    var isChecked = e.detail.value;
    var c = new PassConfig();
    c.clone(this.data.config)
    c.isUpper = isChecked;

    this.setData({
      config : c
    })
    this.refreshView();
  },

  onSwitchNumber: function(e) {
    var isChecked = e.detail.value;
    var c = new PassConfig();
    c.clone(this.data.config);
    c.isNumber = isChecked;

    this.setData({
      config: c,
    })
    this.refreshView();
  },

  onClickLength: function(e) {
    var index = e.detail.value;
    var c = new PassConfig();
    c.clone(this.data.config);
    c.length = this.data.lengthList[index]

    this.setData({
      config: c
    })
    this.refreshView();
  },
  onClickOptions: function(e) {
    var visible = !this.data.showOptions
    this.setData({
      showOptions: visible
    })
  },
  updateAction: function()
  {
    var actiontype = 0 // 0: none, 1: history 2:delete 3:update 4:save
    if(this.config0 == null)
    {
      if((this.data.config.service == "" || this.data.config.service == null) 
      && this.serviceList.list.length > 0)
      {
        actiontype = 1
      }
    }
    else
    {
      if(this.data.config.service == "" || this.data.config.service == null)
      {
        actiontype = 1
      }
      else if(this.data.config.service == this.config0.service)
      {
        this.data.config.equal(this.config0) ? actiontype = 2 : actiontype = 3
      }
    }

    this.setData({
      actionType: actiontype,
    })
  },

  refreshView: function()
  {
    this.generatePassword();
    this.updateAction();    
  },

  checkServiceInput: function()
  {
    var service = this.data.config.service;
    var index = this.serviceList.list.indexOf(service)
    console.log(index)
    if(index > -1)
    {
      var c = new PassConfig();
      c.load(service);
      if(this.config0 == null)
      {
        this.config0 = new PassConfig();
      }
      this.config0.clone(c);
  
      this.setData({
        config: c,
      })
    }
  },
})