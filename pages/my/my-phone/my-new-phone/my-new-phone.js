import { Base } from '../../../../utils/base.js';
import { Api } from '../../../../utils/api.js';
var _base = new Base();
var _api = new Api();

Page({
  data: {
    phone: '',
    code: '',
    time: 60,
    loadingConfirm: false,
    disabledConfirm: false
  },

  onLoad: function (options) {

  },

  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  codeInput: function (e) {
    this.setData({
      code: e.detail.value
    })
  },

  formValidateCode: function (phone) {
    var result = {
      status: false,
      msg: ''
    }
    if (!_base.validate(phone, 'require')) {
      result.msg = '请输入手机号';
      return result;
    }
    if (!_base.validate(phone, 'phone')) {
      result.msg = '手机号格式不正确';
      return result;
    }
    result.status = true;
    result.msg = '';
    return result;
  },

  formValidateConfirm: function (phone, code) {
    var result = {
      status: false,
      msg: ''
    }
    if (!_base.validate(phone, 'require')) {
      result.msg = '请输入手机号';
      return result;
    }
    if (!_base.validate(phone, 'phone')) {
      result.msg = '手机号格式不正确';
      return result;
    }
    if (!_base.validate(code, 'require')) {
      result.msg = '请输入验证码';
      return result;
    }
    result.status = true;
    result.msg = '';
    return result;
  },

  onCodeTap: function () {
    var phone = this.data.phone;
    var currentTime = this.data.time;
    var validateResult = this.formValidateCode(phone);
    if (!validateResult.status) {
      _base.showToast(validateResult.msg);
    }
    if (validateResult.status && currentTime === 60) {
      _api.getCode(phone, 2 ,(res) => {
        _base.showToast('验证码已发送', 'success');
      });
      var countDown = setInterval(() => {
        this.setData({
          time: this.data.time - 1
        });
        if (this.data.time === 0) {
          clearInterval(countDown);
          this.setData({
            time: 60
          });
        }
      }, 1000);
    }
  },

  onConfirmTap: function () {
    var phone = this.data.phone;
    var code = this.data.code;
    var validateResult = this.formValidateConfirm(phone, code);
    if (!validateResult.status) {
      _base.showToast(validateResult.msg);
      return false;
    }
    this.setData({
      loadingConfirm: true,
      disabledConfirm: true
    });
    _api.updateMobile(phone, code, (res) => {
      console.log(res);
      this.setData({
        loadingConfirm: false,
        disabledConfirm: false
      });
      _base.showToast('成功更换手机号码!', 'success', 2000, function(){
        setTimeout(function(){
          wx.navigateBack({
            delta: 2
          })
        }, 1000)
      })
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
    let pages = getCurrentPages();
    console.log(pages)
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
    // wx.navigateBack({
    //   delta: 2
    // })
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