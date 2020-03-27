import { Base } from '../../../../utils/base.js';
import { Api } from '../../../../utils/api.js';
var _base = new Base();
var _api = new Api();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Obj: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  showConfirm(content, cancelFlag) {
    wx.showModal({
      title: "",
      content: content || "",
      showCancel: true,
      cancelText: '仍要取消',
      cancelColor: '#999999',
      confirmText: '不要',
      confirmColor: '#FF5D22',
      success: function (res) {
        if (res.cancel && cancelFlag) {
          _base.showToast('取消成功', 'success');
        }
      }
    })
  },

  onCancelTap() {
    this.showConfirm('你要取消申请退订金吗？', true);
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