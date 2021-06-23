// pages/intelligence/intelligence.js
const app = getApp();
import {
  Base
} from '../../utils/base.js';
let _base = new Base();

import {
  login
} from '../../utils/login.js';
var _login = new login();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper: [{
        url: 'http://img.duorang.com/upload/img/pic_1.jpg'
      },
      {
        url: 'http://img.duorang.com/upload/img/pic_2.jpg'
      },
      {
        url: 'http://img.duorang.com/upload/img/pic_3.jpg'
      },
      {
        url: 'http://img.duorang.com/upload/img/pic_4.jpg'
      },
    ],
    swiper_1: [{
      url: 'http://img.duorang.com/upload/img/ck_1.jpg',
        txt: '商家实际控制人已签署个人承担无限连带责任承诺函，并缴纳保证金（个别新项目除外）',
        title: '商家实控人无限责任承诺函'
      },
      {
        url: 'http://img.duorang.com/upload/img/ck_2.jpg',
        txt: '商家的身份信息、经营资质、品牌授权资格认证建档',
        title: '商家信息备案'
      },
      {
        url: 'http://img.duorang.com/upload/img/ck_3.jpg',
        txt: '集采现场可要求商家出示多让签字盖章的价格文件',
        title: '集采价格表'
      },
    ],

    newswiper_1: [],
    box: [{
        url: 'http://img.duorang.com/upload/img/list_1.png',
        name: "社群需求收集"
      },
      {
        url: 'http://img.duorang.com/upload/img/list_2.png',
        name: "买手市场考察"
      },
      {
        url: 'http://img.duorang.com/upload/img/list_3.png',
        name: "商家甄选"
      },
      {
        url: 'http://img.duorang.com/upload/img/list_4.png',
        name: "协议签署"
      },
      {
        url: 'http://img.duorang.com/upload/img/list_5.png',
        name: "对比价格"
      },
      {
        url: 'http://img.duorang.com/upload/img/list_6.png',
        name: "审核资质"
      },
      {
        url: 'http://img.duorang.com/upload/img/list_7.png',
        name: "正式开团"
      },
      {
        url: 'http://img.duorang.com/upload/img/list_8.png',
        name: "业主参团"
      },
      {
        url: 'http://img.duorang.com/upload/img/list_9.png',
        name: "无忧下单"
      },
    ],
    shareHome: false,
    height: 0,
    userId: ''
  },
  //返回首页
  returnHome() {
    wx.reLaunch({
      url: '/pages/group/group?village_id=22'
    })
  },

  //预览图片公共
  pImage: function(e, that) {
    wx.previewImage({
      current: that.data.newswiper_1[e.currentTarget.dataset.index],
      urls: that.data.newswiper_1
    })
  },
  //口碑介绍 轮播
  showPic: function(e) {
    this.pImage(e, this)
  },
  onLoad: function(options) {
    console.log(options, "options")
    let that = this;
    let h = wx.getSystemInfoSync().windowHeight;
    var newswiper_1 = this.data.newswiper_1;
    for (var i = 0; i < this.data.swiper_1.length; i++) {
      newswiper_1.push(this.data.swiper_1[i].url)
    }
    if (options.shareType == 1) {
      this.setData({
        shareHome: true,
        height: h
      });
    }
    this.setData({
      newswiper_1: this.data.newswiper_1
    })

    if (options.userId) {
      this.setData({
        userId: options.userId
      })
    }
    wx.getSetting({
      success(res) {
        console.log('授权状态', res.authSetting)
        if (res.authSetting['scope.userInfo']) {
          let state = wx.getStorageSync('loginStatus');
          if (!state) {
            _login.getToken(that.data.userId);
          }
        }
        // else { ****
        //   that.setData({
        //     loginData: {
        //       show_modal: true,
        //       height: wx.getSystemInfoSync().screenHeight
        //     },
        //   })
        // }
      }
    })

  },
  //调起用户授权
  getUser: function(e) {
    let that = this;
    console.log("用户授权信息");
    if (e.detail.errMsg == "getUserInfo:ok") {
      wx.setStorageSync('avatarUrl', e.detail.userInfo.avatarUrl);
      wx.setStorageSync('nickName', e.detail.userInfo.nickName);
      wx.setStorageSync('encrypted', e.detail);
      that.setData({
        loginData: {
          show_modal: false,
          height: wx.getSystemInfoSync().screenHeight
        },
      })
      _login.getToken(that.data.userId)
    }
  },
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var loginUserId = wx.getStorageSync('loginUser');
    console.log(`%c 阿文提醒您：业主服务分享者ID为：${loginUserId.loginUserId}`, `color:#f00;font-weight:bold;`)

    let obj = {
      title: '只为业主服务,值得信赖的消费者代理人',
      url: "pages/intelligence/intelligence?shareType=1&userId=" + loginUserId.id + "",
      img: '../../images/group.jpg'
    }
    return _base.shareData(obj);
  }
})