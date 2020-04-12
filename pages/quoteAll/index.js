import {Base} from '../../utils/base.js';
import {Api} from '../../utils/api.js';
import {login} from '../../utils/login.js';
var _login = new login();
var _base = new Base();
var _api = new Api();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newProductLbw:[],//
  },

  //选择软装项目
  changeProduct: function (e) {

    var item = _base.getDataSet(e,'item');
    var { id, code, shareName, shareUrl, target_url, category_desc} = item
 
    wx.navigateTo({
      url: target_url + '?shareCategoryId=' + id + '&shareName=' + shareName + '&shareUrl=' + shareUrl + '&code=' + code + '&category_desc=' + category_desc
    })
  },

  onLoad: function (options) {

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
 //封窗，橱柜，地暖等.....
    _api.selectCategoryList(res => {
      this.setData({
        newProductLbw: res,
      })
    })
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