class PassConfig {
  service = ""
  length= 8
  isUpper= true
  isLower= true
  isNumber= true
  isSymbol= false
  equal = obj => {
    return (obj.isUpper == this.isUpper
      && obj.isLower == this.isLower
      && obj.isNumber == this.isNumber
      && obj.isSymbol == this.isSymbol
      && obj.length == this.length) ? true : false;
  }
  clone = obj => {
    this.service = obj.service
    this.length = obj.length
    this.isUpper = obj.isUpper
    this.isLower = obj.isLower
    this.isNumber = obj.isNumber
    this.isSymbol = obj.isSymbol
  }
  load = key => {
    var json = "";
    try {
      json = wx.getStorageSync(key);
    } catch (error) {
      console.error(error);
    }
    if(json == "" || json == null)
    {
      console.warn(key + " not exist. load config failed.")
      return;
    }
    var obj = JSON.parse(json);
    this.clone(obj);
  }
  save = () => {
    var json = JSON.stringify(this);
    try {
      wx.setStorageSync(this.service, json)
    } catch (error) {
      console.error(error);
    }
  }
  remove = () => {
    try {
      wx.removeStorageSync(this.service)
    } catch (error) {
      console.error(error);
    }
  }
  reset = () => {
    this.service = ""
    this.length = 8
    this.isUpper = true
    this.isLower = true
    this.isNumber = true
    this.isSymbol = false
  }
}

module.exports = {
  PassConfig: PassConfig
}