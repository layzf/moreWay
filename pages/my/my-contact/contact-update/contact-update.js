import { Base } from '../../../../utils/base.js';
import { Api } from '../../../../utils/api.js';
var _base = new Base();
var _api = new Api();
Page({
  data: {
    contact:{
      id: '',
      name: '',
      phone: ''
    }
  },
  
  onLoad: function (options) {
    console.log(options);
    wx.hideShareMenu();
    this.setData({
      contact: options
    });
  },

  nameInput: function (e) {
    let contact = this.data.contact;
    contact.name = e.detail.value;
    this.setData({
      contact: contact
    })
  },

  phoneInput: function (e) {
    let contact = this.data.contact;
    contact.phone = e.detail.value;
    this.setData({
      contact: contact
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
    if (!_base.validate(para.phone, 'require')) {
      result.msg = '请输入手机号';
      return result;
    }
    result.status = true;
    result.msg = '';
    return result;
  },

  onConfirmTap: function () {
    let para = {};
    para.name = this.data.contact.name;
    para.phone = this.data.contact.phone;
    para.id = this.data.contact.id;
    var validateResult = this.formValidateSubmit(para);
    if (!validateResult.status) {
      _base.showToast(validateResult.msg);
      return false;
    }else{
      _api.updateContact(para.name, para.phone, para.id,(res)=>{
        console.log(res);
        _base.showToast('保存成功', 'success');
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          });
        }, 500);
      })
    }
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