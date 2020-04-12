// pages/leadMap/leadMap.js

import { Api } from "../../utils/api";
import { Base } from "../../utils/base";
import { login } from '../../utils/login.js';

let _base = new Base();
let _api = new Api();
let _login = new login();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    orderList:[
      {name:'东鹏洁具1',date:'2017-05-06'},
      {name:'东鹏洁具1',date:'2017-05-06'},
      {name:'东鹏洁具1',date:'2017-05-06'},
      {name:'东鹏洁具1',date:'2017-05-06'},
      {name:'东鹏洁具1',date:'2017-05-06'},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user = wx.getStorageSync('loginUser');
    var obj = {
      icon:user.icon,
      user_name: user.user_name,
      mobile:user.mobile
    };
    this.setData({
      user: obj
    })
    this.getDeposits(options);
  },
//订金数据
  getDeposits(options) {
    /*
      id = 9 , 查询全部订金单
    */
    var pid = options.pid //店鋪ID
    _api.getDeposits(9, { businessShopId:pid},(res) => {
        res.forEach((ele) => {
          ele.pay_at = ele.pay_at.split(' ')[0];
        });
        this.setData({
          orderList: res
        });

      

    });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})