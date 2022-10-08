//app.js
App({
  onLaunch: function () {
    console.log("App.onLaunch");
    //this.initCloud();
    this.initShare();
  },

  // initCloud: function()
  // {
  //   if (!wx.cloud) {
  //     console.error('请使用 2.2.3 或以上的基础库以使用云能力')
  //   } else {
  //     wx.cloud.init({
  //       traceUser: true,
  //     })
  //   }
  // },

  initShare: function()
  {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
})