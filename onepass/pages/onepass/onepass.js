//onepass.js
import Vault from '../../vault/vault'
import {
    OnePassConfig
} from '../../models/pass_config'
import {
    DataManager
} from '../../models/data_manager'
import {
    SERVICE_STATUS
} from '../../models/const'

Page({
    data: {
        passphrase: "",
        password: "",
        lengthList: [6, 8, 10, 12, 16, 20, 24, 32],
        serviceRange: [],
        config: {},
        showOptions: false,
        showHistoryIcon: false,
        showSettingIcon: false,
        readOnly: false,
        showDeleteConfirm: false,
        showFigerprintSaveIcon: false,
        showFigerprintIcon: false,
        showFigerprintDeleteIcon: false,
        showCopyButton: false,
        topTips: false,
        tips: "",
    },

    supportFigerprint: false,
    passphrase: "",
    service_list: [],
    original_config: new OnePassConfig(),
    current_config: new OnePassConfig(),
    dbm: new DataManager(),

    onLoad: function () {
        this.load_service_list();
        this.check_figerprint()
        this.setData({
            config: this.current_config
        })
        // this.dbm.save_passphrase("323232")
        this.update_passphrase_icon("")
    },

    onShareAppMessage: function(res)
    {
        return {
            title: 'Password Manager',
            path: '/pages/onepass/onepass',
            imageUrl: '/images/share.png'
        }
    },

    onShareTimeline: function(res)
    {
        return {
            title: 'Password Manager',
            path: '/pages/onepass/onepass',
            imageUrl: '/images/share.png'
        }
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

        if(this.service_list.findIndex((item) => {
            return item.service == this.current_config.service;
        }) > -1)
        {
            return;
        }

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
        this.update_passphrase_icon(this.passphrase)
        this.generatePassword();
    },

    on_ui_click_save_figerprint: function(e)
    {
        this.dbm.save_passphrase(this.passphrase)
        this.setData({
            passphrase: this.passphrase,
            showFigerprintDeleteIcon: true,
            showFigerprintIcon: false,
            showFigerprintSaveIcon: false,
        })
        this.show_tips("密钥已保存")
    },

    on_ui_click_figerprint: function(e)
    {
        var self = this
        wx.startSoterAuthentication({
            requestAuthModes: ['fingerPrint'],
            challenge: '123456',
            authContent: '使用指纹读取本地密钥',
            success(res) {
                var p = self.dbm.load_passphrase()
                self.passphrase = p;
                self.update_passphrase_icon(self.passphrase);
                self.setData({
                    passphrase: self.passphrase,
                    showFigerprintDeleteIcon: true,
                })
                self.generatePassword()
            },
            fail(err) {
                console.log(err)
            }
        })
    },

    on_ui_click_delete_figerprint: function(e)
    {
        var self = this
        wx.startSoterAuthentication({
            requestAuthModes: ['fingerPrint'],
            challenge: '123456',
            authContent: '确认删除本地密钥？',
            success(res) {
                self.dbm.remove_passphrase()
                self.passphrase = "";
                self.setData({
                    passphrase: self.passphrase
                })
                self.update_passphrase_icon(self.passphrase);
                self.generatePassword();
                self.show_tips("密钥已删除");
            },
            fail(err) {
                console.log(err)
            }
        })
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
            this.setData({
                showHistoryIcon: true,
                showSettingIcon: false,
            })
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
            this.show_tips("配置已保存");
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
            this.passphrase = "",
            this.setData({
                showOptions: false,
                readOnly: false,
                config: this.current_config,
                showDeleteConfirm: false,
                passphrase: this.passphrase
            })
            this.update_passphrase_icon(this.passphrase)
            this.generatePassword();
            this.show_tips("条目已删除");
        })
    },

    update_servce_list() {
        var service_range = this.service_list.map((item) => {
            return item.service;
        })

        this.setData({
            serviceRange: service_range,
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
                    showDeleteConfirm: false
                });
            } else if (this.check_service_name(service) == SERVICE_STATUS.MATCH) {
                this.load_service(service);
            } else if (this.check_service_name(service) == SERVICE_STATUS.UNMATCH) {
                this.setData({
                    showSettingIcon: true,
                    showHistoryIcon: false,
                    config: this.current_config,
                    readOnly: false,
                    showDeleteConfirm: false
                });
            }
        }
    },

    update_passphrase_icon(passphrase) {
        if(this.supportFigerprint == false)
        {
            this.setData({
                showFigerprintIcon: false,
                showFigerprintSaveIcon: false,
                showFigerprintDeleteIcon: false,
            })
            return;
        }
        var p = this.dbm.load_passphrase()

        // 有本地记录
        if(p != null && p != "")
        {
            // 无输入，显示指纹按钮
            if(passphrase == null || passphrase == "")
            {
                this.setData({
                    showFigerprintIcon: true,
                    showFigerprintSaveIcon: false,
                    showFigerprintDeleteIcon: false,
                })
            }
            // // 匹配，显示删除按钮
            // else if(p == passphrase)
            // {
            //     this.setData({
            //         showFigerprintIcon: false,
            //         showFigerprintSaveIcon: false,
            //         showFigerprintDeleteIcon: true,
            //     })
            // }
            // 无匹配，无操作按钮
            else
            {
                this.setData({
                    showFigerprintIcon: false,
                    showFigerprintSaveIcon: false,
                    showFigerprintDeleteIcon: false,
                })
            }
        }
        // 无本地记录
        else
        {
            // 无输入，显示指纹按钮
            if(passphrase == null || passphrase == "")
            {
                this.setData({
                    showFigerprintIcon: false,
                    showFigerprintSaveIcon: false,
                    showFigerprintDeleteIcon: false,
                })
            }
            // 输入，显示保存按钮
            else
            {
                this.setData({
                    showFigerprintIcon: false,
                    showFigerprintSaveIcon: true,
                    showFigerprintDeleteIcon: false,
                })
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

    check_figerprint()
    {
        var self = this
        wx.checkIsSupportSoterAuthentication({
        success(res) {
            // res.supportMode = [] 不具备任何被SOTER支持的生物识别方式
            // res.supportMode = ['fingerPrint'] 只支持指纹识别
            // res.supportMode = ['fingerPrint', 'facial'] 支持指纹识别和人脸识别
            if(res.supportMode.indexOf('fingerPrint') > -1)
            {
                self.supportFigerprint = true;
                self.update_passphrase_icon(self.passphrase);
            }
        },
        fail(err)
        {
            console.log(err)
        }})
    },

    show_tips: function(tips) {
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

    generatePassword: function () {
        if (this.passphrase == "" || this.current_config.service == "") {
            this.password = ""
            this.setData({
                password: this.password,
                showCopyButton: false
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
            this.setData({
                password: this.password,
                showCopyButton: true
            });
        } catch (error) {
            console.log(error)
        }

    },
})