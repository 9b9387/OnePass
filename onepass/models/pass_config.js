/**
 * 密码配置的数据类型
 */
class OnePassConfig {

    constructor()
    {
        this.reset();
    }

    /**
     * 重置
     */
    reset()
    {
        this.service = "";
        this.length = 16;
        this.include_alpha = true;
        this.include_number = true;
        this.include_symbol = true;
    }

    /**
     * 比较数据是否一致
     * @param {OnePassConfig} obj 
     */
    equal(obj) 
    {
        return (obj.service == this.service
            && obj.length == this.length
            && obj.include_alpha == this.include_alpha
            && obj.include_number == this.include_number
            && obj.include_symbol == this.include_symbol) ? 
            true : false;
    }

    /**
     * 从其他对象复制数据
     * @param {OnePassConfig}} obj 
     */
    clone(obj) 
    {
        this.service = obj.service
        this.length = obj.length
        this.include_alpha = obj.include_alpha
        this.include_number = obj.include_number
        this.include_symbol = obj.include_symbol
    }

    from(key, obj)
    {
      this.service = key
      this.length = obj.length
      this.include_alpha = obj.lower == 1 || obj.upper == 1
      this.include_number = obj.number == 1
      this.include_symbol = obj.symbol == 1 || obj.dash == 1
    }
}

module.exports = {
    OnePassConfig: OnePassConfig
}