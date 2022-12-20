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
	tipsStyle: "weui-toptips-info"
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    this.setData({config_json: ""})
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
	  DataManager.save_passphrase(import_data.global.phrase);
      
      let keys = Object.keys(import_data.services);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = import_data.services[key];
        let config = new OnePassConfig();
        config.from(key, value);
        DataManager.save_service(config)
	  }
	  this.show_tips("配置导入成功", "weui-toptips-info");

    } catch (error) {
	  this.show_tips("配置导入失败", "weui-toptips-warn");
	}
	
  },

  on_ui_click_export: function(e)
  {
		var data = {};
		data.global = {
			dash: 1,
			length: 16,
			lower: 1,
			number: 1,
			phrase: DataManager.load_passphrase(),
			space: 0,
			symbol: 1,
			upper: 1
		}

		data.services = {}
		DataManager.load_service_list((keys) => {
		for (let index = 0; index < keys.length; index++) {
			const key = keys[index];
			var config = JSON.parse(wx.getStorageSync(DataManager.config_prefix.concat(key)))
			data.services[key] = {
				dash: config.include_symbol == true ? 1 : 0,
				length: config.length,
				lower: config.include_alpha == true ? 1 : 0,
				number: config.include_number == true ? 1 : 0,
				space: 0,
				symbol: config.include_symbol == true ? 1 : 0,
				upper: config.include_alpha == true ? 1 : 0
			}
		}

		let json_str = JSON.stringify(data);
		this.setData({
			config_json: json_str
		})

        wx.setClipboardData({
            data: json_str,
        })
		this.show_tips("配置已复制至剪切板");
	});
  },

  show_tips: function(tips, tipsStyle) {
    this.setData({
        topTips: true,
		tips: tips,
		tipsStyle: tipsStyle
    });

    setTimeout(() => {
        this.setData({
            topTips: false,
            tips: ""
        });
    }, 2000);
  },
})