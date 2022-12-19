const { DataManager } = require("../../models/data_manager");
const { OnePassConfig } = require("../../models/pass_config");

// pages/import_page.js
Page({

  /**
   * Page initial data
   */
  data: {
    config_json : "",
    topTips: false,
    tips: "",
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    this.setData({config_json: ""})

    DataManager.load_service_list((keys)=>{
      console.log(keys);
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  on_ui_submit(e) {
    let content = e.detail.value.config_content;
    if(content == null || content == "")
    {
      this.show_tips("数据格式错误");
      return;
    }
    try {
      var import_data = JSON.parse(content);
      console.log(import_data.services);
      
      let keys = Object.keys(import_data.services);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = import_data.services[key];
        let config = new OnePassConfig();
        config.from(key, value);
        console.log(config);
        DataManager.save_service(config)
      }
    } catch (error) {
      console.log(error);
    }
  },

  show_tips: function(tips) {
    console.log("show tips");
    this.setData({
        topTips: true,
        tips: tips
    });

    setTimeout(() => {
        this.setData({
            topTips: false,
            tips: ""
        });
    }, 2000);
  },
})