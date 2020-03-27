
//* 使用  <my-commander isTab='{{}}'  height='{{}}' isShow='{{}}' id='my-commander'></my-commander>
//* isTab： 是否是底部tab页面；
//* height： 获取设备高度
//* isShow： 是否显示遮罩
//* id:父页面通过selectComponent('#my-commander') 获得 子组件方法；  

import {
  Base
} from '../../utils/base.js';
import {
  Api
} from '../../utils/api.js';
let _base = new Base();
let _api = new Api();
const app = getApp();

Component({
  properties: {
    // commanders:{
    //   type:Array,
    //   value:[]
    // },
    isTab:{
      type: Boolean,
      value: false
    },
    height:{
      type:Number,
      value:0
    },
    isShow:{
      type:Boolean,
      value:false
    },

    orderListType:{  //验房团小区 显示控制
      type:Boolean,
      value:false,
    },

    orderInformation:{
      type:Object,
      observer: function (data) {
        if(Object.getOwnPropertyNames(data).length){
          var comd = {
            icon: this.data.orderListType ? data.group_link_icon : 'http://img.duorang.com/upload/v/head.png',
            wechat: this.data.orderListType ? data.group_link_wx : 'wj572494600',
            mobile: this.data.orderListType ? data.tell : '15629083308',
            name: this.data.orderListType ? data.name : '王李伟'
          }
          this.setData({
            commandar: comd
          })

        }
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    showAddress: false,
    addShow: false,
    showLogin: false,
    mask: false,
    commandar: {},
    count: 786,
    height: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    previewCodeImage: function (event) {
      let code = _base.getDataSet(event, 'code');
      console.log(code);
      wx.previewImage({
        current: code,
        urls: [code]
      })
    },
    hidenCommander:function(){
      this.setData({
        isShow:false
      })
    },
    //隐藏
    hideRow(e) {
      this.setData({
        mask: false
      })
      setTimeout(() => {
        this.setData({
          showLogin: false
        })
      }, 10)
    },

    onAddressTap: function (event) {
      this.setData({
        showAddress: !this.data.showAddress
      })
    },

    onCallTap: function (event) {
      let phone = _base.getDataSet(event, 'phone');
      wx.makePhoneCall({
        phoneNumber: phone,
        success: function () {
          console.log("拨打电话成功！")
        },
        fail: function () {
          console.log("拨打电话失败！")
        }
      })
    },
    //获取团长信息
    getInfo() {
      let that = this;
      _api.getGroupInfo(res => {
        console.log(res,"团长")
        var b = (JSON.stringify(res) == "{}");
        if (!b) {
          that.setData({ commandar: res.group, count: res.memberCount })
          wx.setStorageSync('teamPhone', res.group.mobile)
        } else {
          var commandar = { 
            icon: 'http://img.duorang.com/upload/v/head.png',
            wechat: 'wj572494600',
            mobile:'15629083308',
            name: '王李伟'
          }
          this.setData({ commandar: commandar })
        }
      })
    },
    addWeixin() {
      this.setData({
        addShow: true
      });
    },
    //拨打电话
    callPhone() {
      let phone = this.data.orderListType ? this.data.orderInformation.tell : this.data.commandar.mobile
      wx.makePhoneCall({
        phoneNumber: phone //仅为示例，并非真实的电话号码
      })
    },
    //复制微信
    copyWechat() {
      let that = this;
      let wechat = this.data.commandar.wechat;
      wx.setClipboardData({
        data: wechat,
        success: function (res) {
          that.setData({
            showLogin: true
          })
          setTimeout(() => {
            that.setData({
              mask: true
            })
          }, 10)
        }
      });
    }

  }
})
