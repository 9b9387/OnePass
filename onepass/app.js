//app.js
App({
  onLaunch: function () {
    this.initShare();
  },

  initShare: function()
  {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
})