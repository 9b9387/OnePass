//onepass.js
import Vault from '../../vault/vault'
import {
    PassConfig
} from '../../models/passconfig'
import {
    OnePassConfig
} from '../../models/pass_config'
import {
    ServiceList
} from '../../models/servicelist'
import {
    DataManager
} from '../../models/data_manager'
import {
    SERVICE_STATUS
} from '../../models/const'

Page({
    data: {
        password: "",
        lengthList: [6, 8, 10, 12, 16, 20, 24, 32],
        serviceRange: [],
        config: {},
        showOptions: false,
        showHistoryIcon: false,
        showSettingIcon: false,
        readOnly: false,
        showDeleteConfirm: false,
    },

    passphrase: "",
    service_list: [],
    original_config: new OnePassConfig(),
    current_config: new OnePassConfig(),
    dbm: new DataManager(),

    onLoad: function () {
        this.load_service_list();
    },

    ///////////////////////////////////////////////////
    // UI Event
    ///////////////////////////////////////////////////
    on_ui_select_service(e) {
        var index = e.detail.value;
        var config = this.service_list[index];

        this.load_service(config.service);
    },

    on_ui_service_change(e) {
        var text = e.detail.value;
        this.update_setting(text);
        this.generatePassword();
    },


    on_ui_click_setting(e) {
        this.setData({
            showOptions: !this.data.showOptions,
            showDeleteConfirm: false
        })
    },

    on_ui_select_length: function (e) {
        var index = e.detail.value;
        var length = this.data.lengthList[index]
        this.current_config.length = length;

        this.setData({
            config: this.current_config
        })
        this.generatePassword();
    },

    on_ui_toggle_alpha: function (e) {
        var isChecked = e.detail.value;
        this.current_config.include_alpha = isChecked;

        this.setData({
            config: this.current_config
        })
        this.generatePassword();
    },

    on_ui_toggle_number: function (e) {
        var isChecked = e.detail.value;
        this.current_config.include_number = isChecked;

        this.setData({
            config: this.current_config
        })
        this.generatePassword();
    },

    on_ui_toggle_symbol: function (e) {
        var isChecked = e.detail.value;
        this.current_config.include_symbol = isChecked;

        this.setData({
            config: this.current_config
        })
        this.generatePassword();
    },

    on_ui_click_copy: function (e) {
        wx.setClipboardData({
            data: this.password,
        })

        this.save_service(this.current_config);
    },

    on_ui_click_delete: function (e) {
        this.setData({
            showDeleteConfirm: true,
        })
    },

    on_ui_confirm_delete: function (e) {
        this.remove_service(this.current_config.service);
    },

    on_ui_cancel_delete: function (e) {
        this.setData({
            showDeleteConfirm: false,
        })
    },

    on_ui_passphrase_change: function (e) {
        this.passphrase = e.detail.value;
        this.generatePassword();
    },

    ///////////////////////////////////////////////////
    // Logic
    ///////////////////////////////////////////////////
    load_service_list() {
        this.dbm.load_service_list((res) => {
            this.service_list = res.result.data;
            if (res.result.data.length == 0) {
                this.setData({
                    showHistoryIcon: false,
                    showSettingIcon: false,
                })
                return;
            }
    
            this.update_servce_list();
        }, 
        (err) => {
            console.error("on_load_service_list_fail", err);
            this.setData({
                showHistoryIcon: false,
                showSettingIcon: false,
            })
        });
        this.setData({
            config: this.current_config
        })
    },

    save_service(config) {
        this.dbm.save_service(config, (res) => {

            if (res.result.errCode != 0) {
                console.log("save_service error.")
                return;
            }
            var c = res.result.config;
            this.original_config.clone(c);

            this.service_list.push({
                service: c.service
            })
            this.update_servce_list();

            this.update_setting(c.service);
        })
    },

    load_service(service) {
        this.dbm.load_service(service, (res) => {
            console.log(res);
            var data = res.result.data;
            if (data.length > 0) {
                var config = data[0];

                this.original_config.clone(config)
                this.current_config.clone(config)

                this.setData({
                    config: this.original_config,
                    showSettingIcon: true,
                    showHistoryIcon: false,
                    readOnly: true,
                })

                this.generatePassword();
            }
        })
    },

    remove_service(service) {
        this.dbm.remove_service(service, (res) => {
            console.log(res);

            this.current_config.reset();
            this.original_config.reset();
            var index = this.service_list.findIndex((item) => {
                return item.service == service;
            })
            if (index > -1) {
                this.service_list.splice(index, 1);
            }
            this.update_servce_list();
            this.update_setting(this.current_config.service)
            this.setData({
                showOptions: false,
                readOnly: false,
                config: this.current_config,
                showDeleteConfirm: false,
            })
            this.generatePassword();
        })
    },

    update_servce_list() {
        var service_range = this.service_list.map((item) => {
            return item.service;
        })

        this.setData({
            serviceRange: service_range,
            showHistoryIcon: true,
            showSettingIcon: false,
        })
    },

    update_setting(service) {
        this.current_config.service = service;

        if (this.service_list.length == 0) {
            if (this.check_service_name(service) != SERVICE_STATUS.EMPTY) {
                this.setData({
                    showSettingIcon: true,
                    showHistoryIcon: false,
                    config: this.current_config,
                    readOnly: false,
                });
            } else {
                this.setData({
                    showSettingIcon: false,
                    showHistoryIcon: false,
                    showOptions: false,
                    readOnly: false,
                });
            }
        } else {
            if (this.check_service_name(service) == SERVICE_STATUS.EMPTY) {
                this.original_config.reset();

                this.setData({
                    showSettingIcon: false,
                    showHistoryIcon: true,
                    showOptions: false,
                    readOnly: false,
                });
            } else if (this.check_service_name(service) == SERVICE_STATUS.MATCH) {
                this.load_service(service);
            } else if (this.check_service_name(service) == SERVICE_STATUS.UNMATCH) {
                this.setData({
                    showSettingIcon: true,
                    showHistoryIcon: false,
                    config: this.current_config,
                    readOnly: false,
                });
            }
        }
    },

    check_service_name(service_name) {
        if (service_name == null || service_name == "") {
            return SERVICE_STATUS.EMPTY;
        }

        let isMatch = false;
        for (let index = 0; index < this.service_list.length; index++) {
            const element = this.service_list[index];
            if (service_name == element.service) {
                isMatch = true;
                break;
            }
        }

        if (isMatch) {
            return SERVICE_STATUS.MATCH;
        } else {
            return SERVICE_STATUS.UNMATCH;
        }
    },

    generatePassword: function () {
        if (this.current_config.service == "") {
            this.password = ""
            this.setData({
                password: this.password
            });
            return;
        }
        var v = new Vault({
            phrase: this.passphrase,
            lower: this.current_config.include_alpha ? 1 : 0,
            upper: this.current_config.include_alpha ? 1 : 0,
            space: 0,
            dash: this.current_config.include_symbol ? 1 : 0,
            symbol: this.current_config.include_symbol ? 1 : 0,
            number: this.current_config.include_number ? 1 : 0,
            length: this.current_config.length
        });
        this.password = ""
        try {
            this.password = v.generate(this.current_config.service)
        } catch (error) {
            console.log(error)
        }

        this.setData({
            password: this.password
        });
    },
})