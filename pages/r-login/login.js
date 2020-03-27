// pages/r-login/login.js
import {
    Base
} from '../../utils/base.js';
import {
    Api
} from '../../utils/api.js';
import {
    login
} from '../../utils/login.js';
var _login = new login();
var _base = new Base();
var _api = new Api();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:0,
    show:false,
    mask:false,
    option:null
  },
    //其他登陆
  changeStatus(){
    let s = this.data.show;
    let m = this.data.mask;
    this.setData({
        show:!s
    })
      setTimeout(()=>{
          this.setData({
              mask:!m
          })
      },10)
  },
    //关闭其他登陆
  hideRow(e){
      this.setData({
          mask:false
      })
      setTimeout(()=>{
          this.setData({
              show:false
          })
      },300)
  },
  wxLogin(e){
        console.log(e);
        let data = e.detail.encryptedData;
        let iv = e.detail.iv;
        let option = this.data.option;
        if(e.detail.errMsg === "getPhoneNumber:ok") {
            _api.wxLogin({data:data,iv:iv},res=>{
                if(res.resultCode===1000){
                    wx.setStorageSync("loginStatus", res.data.loginstatus);
                    wx.setStorageSync("loginUser", res.data.loginUser);
                    let d = JSON.parse(option.data);
                    d.uid = res.data.loginUser.id;
                    _api.isSignIn(d,resd=>{
                        if(resd.resultCode===1000){
                            wx.reLaunch({
                                url: '/pages/r-success/success?success=true'
                            })
                        }else if(resd.resultCode === 1004){
                            wx.reLaunch({
                                url: '/pages/r-main/main?data='+JSON.stringify(d)
                            })
                        }else{
                            wx.reLaunch({
                                url: '/pages/r-success/success?success=false'
                            })
                        }
                    })
                }
            })
        }
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log('options',options);
      this.testLogin();
      this.setData({
          option:options
      })
      _login.wxLogin2();
  },
  testLogin(){
      return new Promise(resolve => {
          let sessionId = wx.getStorageSync("sessionId");
          let token = wx.getStorageSync("token");
          if (sessionId == '' || token=='') {
              _login.wxLogin(resolve);
          } else {
              _login.wxLogin(resolve);
          }
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
