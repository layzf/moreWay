// pages/earnest/pay-result/result.js

import {
  Api
} from '../../../utils/api.js';
let _api = new Api()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    progress:true,
    mobile:'',
    payOrder:'',//
    payId:'',
    payType: '',//1：订单，2：定金
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,"options")
    this.setData({
      payId: options.payid,
      payType: options.payorder
    })
    if (options.payorder==1){
      _api.getGroupInfo(res => {
        if (JSON.stringify(res) == "{}"){
          this.setData({
            mobile: '15629083308'
          })
        }else{
          this.setData({
            mobile: res.group.mobile
          })
        }
      });
    }
  },
  //进度条动画结束
  activeend(e){
    this.setData({
      progress: false
    })
  },

  calltell:function(e){
      var phone = e.currentTarget.dataset.phone;
      wx.makePhoneCall({
        phoneNumber: phone //仅为示例，并非真实的电话号码
      })
    
  },
  end:function(){
    
  },
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