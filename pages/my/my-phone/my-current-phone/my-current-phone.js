import { Base } from '../../../../utils/base.js';
import { Api } from '../../../../utils/api.js';
var _base = new Base();
var _api = new Api();

Page({
  data: {
    phone: "",
    mobile:"",
    code: '',
    time: 60,
    loadingConfirm: false,
    disabledConfirm: false
  },

  onLoad: function (options) {
    wx.hideShareMenu();
    console.log(options);
    let phone = options.phone;
    var mphone = phone.substr(0, 3) + '****' + phone.substr(7);
    this.setData({
      mobile: mphone,
      phone: phone
    })
  },

  codeInput: function (e) {
    this.setData({
      code: e.detail.value
    })
  },

  formValidateConfirm: function (code) {
    var result = {
      status: false,
      msg: ''
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
    if (currentTime === 60) {
      _api.getCode(phone, 1, (res) => {
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

  onConfirmTap: function () {
    var phone = this.data.phone;
    var code = this.data.code;
    var validateResult = this.formValidateConfirm(code);
    if (!validateResult.status) {
      _base.showToast(validateResult.msg);
      return false;
    }
    this.setData({
      loadingConfirm: true,
      disabledConfirm: true
    });
    _api.doLogin(phone, code, (res) => {
      this.setData({
        loadingConfirm: false,
        disabledConfirm: false
      });
      wx.navigateTo({
        url: '/pages/my/my-phone/my-new-phone/my-new-phone'
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