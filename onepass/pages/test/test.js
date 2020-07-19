// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    showOptions: true,
    config: {length:1},
    lengthList: [1,2,3],
    items:[
      {name: "a", checked: false, value: "A-Z"},
      {name: "a", checked: false, value: "a-z"},
      {name: "a", checked: false, value: "_-"},
    ]
  },

  testData: null,

  onClickMore: function()
  {
    this.setData({
      isShow: !this.data.isShow
    })
  },

  onClickSetting: function()
  {
    this.setData({
      showOptions: !this.data.showOptions
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  ontest: function()
  {
    wx.cloud.callFunction({
      name: 'save_service',
      data: {
        service: "google"
      },
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.error(err)
      }
    })
  },

  ontest2: function()
  {
    wx.cloud.callFunction({
      name: 'load_service_list',
      success: res => {
        console.log(res.result.data);
        if(res.result.data.length > 0)
        {
          this.testData = res.result.data[0]
        }
      },
      fail: err => {
        console.error(err)
      }
    })
  },

  ontest3: function()
  {
    if(this.testData == null)
    {
      return;
    }
    console.log(this.testData);
    wx.cloud.callFunction({
      name: 'remove_service',
      data: this.testData,
      success: res => {
        console.log(res.result.data);
      },
      fail: err => {
        console.error(err)
      }
    })
  }
})