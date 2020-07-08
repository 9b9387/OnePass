class ServiceList {
  list = new Array()

  save = () => {
    var json = JSON.stringify(this.list);
    console.log("save", json)
    wx.setStorageSync("list", json);
  }

  load = () => {
    var json = wx.getStorageSync('list')
    if(json == null || json == "")
    {
      return;
    }
    this.list = JSON.parse(json)
  }

  add = (service) => {
    if(service == null || service == "")
    {
      return;
    }
    var set = new Set(this.list)
    set.add(service)
    this.list = Array.from(set)
    this.save();
  }

  remove = (service) => {
    var set = new Set(this.list)
    set.delete(service);
    this.list = Array.from(set)
    this.save();
  }
}

module.exports = {
  ServiceList: ServiceList
}