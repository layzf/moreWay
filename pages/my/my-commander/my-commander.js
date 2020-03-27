import { Base } from '../../../utils/base.js';
import { Api } from '../../../utils/api.js';
var _base = new Base();
var _api = new Api();
Page({
  data: {
    height:0,
    commanderHiden: true,
    showTab:true
  },
  onLoad: function (options) {
    wx.hideShareMenu()
    let h = wx.getSystemInfoSync().windowHeight;
    this.setData({
        height:h
    })
  },
  onReady: function () {
    
  },
  onShow: function () {
    this.selectComponent('#my-commander').getInfo()
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
