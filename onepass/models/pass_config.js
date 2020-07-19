class OnePassConfig {

    constructor()
    {
        this.reset();
    }

    reset()
    {
        this.service = "";
        this.length = 16;
        this.include_alpha = true;
        this.include_number = true;
        this.include_symbol = true;
    }

    equal(obj) 
    {
        return (obj.service == this.service
            && obj.length == this.length
            && obj.include_alpha == this.include_alpha
            && obj.include_number == this.include_number
            && obj.include_symbol == this.include_symbol) ? 
            true : false;
    }

    clone(obj) 
    {
        this.service = obj.service
        this.length = obj.length
        this.include_alpha = obj.include_alpha
        this.include_number = obj.include_number
        this.include_symbol = obj.include_symbol
    }
}

module.exports = {
    OnePassConfig: OnePassConfig
}