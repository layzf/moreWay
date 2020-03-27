import { Base } from '../../../../utils/base.js';
import { Api } from '../../../../utils/api.js';
var _base = new Base();
var _api = new Api();
Page({
  data: {
    name: '',
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
  },

  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  formValidateSubmit: function (para) {
    var result = {
      status: false,
      msg: ''
    }
    if (!_base.validate(para.name, 'require')) {
      result.msg = '请输入姓名';
      return result;
    }
    if (!_base.validate(para.phone, 'phone')) {
      result.msg = '请输入正确的手机号';
      return result;
    }
    result.status = true;
    result.msg = '';
    return result;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  onConfirmTap: function () {
    let para = {};
    para.name = this.data.name;
    para.phone = this.data.phone;
    var validateResult = this.formValidateSubmit(para);
    if (!validateResult.status) {
      _base.showToast(validateResult.msg);
      return false;
    }else{
      _api.addContact(para.name, para.phone,(res)=>{
        console.log(res);
        _base.showToast('保存成功', 'success',1000,function(){
            wx.navigateBack({
              delta:1
            })
        });
      })
    }
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