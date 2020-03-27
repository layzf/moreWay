import { Base } from '../../../../utils/base.js';
import { Api } from '../../../../utils/api.js';
var _base = new Base();
var _api = new Api();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      id: options.id
    })
  },

  onPayTap: function () {
    var sessionId = wx.getStorageSync('sessionId');
    _api.sunmitService(this.data.id,sessionId, (res) => {
      console.log(res);
      //微信支付
      wx.requestPayment({
        timeStamp: ''+res.timeStamp,
        nonceStr: res.nonceStr,
        package: 'prepay_id=' + res.prepay_id,
        signType: res.signType,
        paySign: res.paySign,
        success: function (data) {
          console.log(data);
          if (data.errMsg == "requestPayment:ok") {
            //支付完成
            wx.navigateTo({
              url: '/pages/result/result-pay/result-pay'
            })
          }
        },
        fail: function (data) {
          console.log("支付失败");
          if (data.errMsg == "requestPayment:fail cancel") {
            console.log("取消支付");
          } else if (data.errMsg == "requestPayment:fail (detail message)") {
            console.log("出现异常");
          }
        }
      })
    })
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