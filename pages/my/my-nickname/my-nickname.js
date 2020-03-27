// pages/my/my-nickname/my-nickname.js
import { Base } from '../../../utils/base.js';
import { Api } from '../../../utils/api.js';
var _base = new Base();
var _api = new Api();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
     this.setData({
       inputValue: options.nickname
     })
  },
  bindReplaceInput(e){
    this.setData({
      inputValue: e.detail.value
    })
  },
  save(){
    if (!this.data.inputValue){
      _base.showToast('请输入昵称')
      return false;
    }
    _api.save_name(this.data.inputValue,(res)=>{
      _base.showToast('修改成功', 'success')
      setTimeout(function(){
        wx.navigateBack({
          delta: 1
        })
      },1000)
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