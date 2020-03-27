import {
  Base
} from '../../utils/base.js';
import {
  Api
} from '../../utils/api.js';
const app = getApp()
var _base = new Base();
var _api = new Api();

Page({
  data: {
    phone: '',
    code: '',
    time: 60,
    loadingLogin: false,
    disabledLogin: false,
    options: ''
  },
  onLoad: function(options) {
    this.setData({
      options: options
    })
  },
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  codeInput: function(e) {
    this.setData({
      code: e.detail.value
    })
  },

  formValidateCode: function(phone) {
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

  formValidateLogin: function(phone, code) {
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
  qrCodes: function() {
    var phone = this.data.phone;
    var codeType = 1;
    var currentTime = this.data.time;
    var validateResult = this.formValidateCode(phone);
    if (!validateResult.status) {
      _base.showToast(validateResult.msg);
    }
    if (validateResult.status && currentTime === 60) {
      _api.getCode(phone, codeType, (res) => {
        console.log(res);
        _base.showToast('验证码已发送至手机', 'success');
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
  onCodeTap: function() {
    setTimeout(res => {
      this.qrCodes();
    }, 200)
  },

  onLoginTap: function() {
    var that = this;
    let phone = this.data.phone;
    let code = this.data.code;
    let validateResult = this.formValidateLogin(phone, code);
    if (!validateResult.status) {
      _base.showToast(validateResult.msg);
      return false;
    }
    this.setData({
      loadingLogin: true,
      disabledLogin: true
    });
    _api.doLogin(phone, code, (res) => {
      if (res.resultCode == 1000) {
        this.setData({
          loadingLogin: false,
          disabledLogin: false
        });
        console.log(res);
        wx.setStorageSync("loginStatus", res.data.loginstatus);
        wx.setStorageSync("loginUser", res.data.loginUser);
        wx.setStorageSync("reqPhone", phone);
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1000,
          success: function() {
            if (that.data.options.judgeLogin == 1) {
              wx.navigateBack({
                delta: 2
              })
            } else {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      } else {
        console.log("请求失败");
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // wx.reLaunch({
    //   url: '/pages/estate/choose-estate'
    // })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})