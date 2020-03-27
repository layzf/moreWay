import {
  Base
} from '../../../../utils/base.js';
import {
  Api
} from '../../../../utils/api.js';
import {
  login
} from '../../../../utils/login.js';
var _login = new login();
var _base = new Base();
var _api = new Api();
const app = getApp();
Page({
  data: {
    judgeStatus: false,
    options: '',
    member: false,
    isLogin:false,
    //show_modal: false,
    show:false,
    mask:false,
    isAuth:false,
    user:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.setData({
      options: options
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  wxLoginGold(e){
      let that = this;
      let data = e.detail.encryptedData;
      let iv = e.detail.iv;
      let s = this.data.show;
      let m = this.data.mask;
      if(e.detail.errMsg === "getPhoneNumber:ok") {
          _api.wxLogin({data:data,iv:iv},res=>{
              console.log('res',res);
              if(res.resultCode===1000){
                  that.setData({
                      isLogin:true
                  })
                  wx.navigateTo({
                      url: "/pages/my/my-member/member-estate-auth/estate-auth-form/estate-auth-form?village_name=" + this.data.options.village_name + "&village_id=" + this.data.options.village_id,
                  })
              }
          })
      }else{
          this.setData({
              isAuth:true,
              show:!s
          })
          setTimeout(()=>{
              this.setData({
                  mask:!m
              })
          },10)
      }
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    _login.login().then((res) => {
      if (res == "loginisnot") {
        wx.getUserInfo({
          success: function (res) {
            console.log(res);
            wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl);
            wx.setStorageSync('nickName', res.userInfo.nickName);
            wx.setStorageSync('encrypted', res);
            that.setData({
              show_modal: false,
            })
            _login.getToken();
            setTimeout(res => {
              app.judge();
            }, 500)
          },
          fail: function () {
            that.setData({
              show_modal: true,
            })
          }
        })
      }
      if (res == "loginisok") {
        console.log("不需要重新授权")
        that.applyVIP();
        if (this.data.options.shareType == 1) {
          app.updateref_user(this.data.options.id);
        }
      }
    });
  },
  applyVIP: function() {
    _api.diffState((res) => {
      console.log('state',res);
      if(res.data.userInfo){
        this.setData({
            isLogin:true,
            user:res.data.userInfo
        })
          if(res.data.userInfo.userAut && res.data.userInfo.userAut.status === 1){
              this.setData({
                  authUser:true
              })
          }else{
              this.setData({
                  authUser:false
              })
          }
      }else{
          this.setData({
              isLogin:false
          })
      }
      if (res.data.user_id != null) {
        var obj = res.data.userInfo;
        if (obj.userAut != null || obj.villageApply != null) {
          this.setData({
            judgeStatus: true,
            village_name: obj.villageInfo.village_name,
            village_id: obj.villageInfo.id,
            id: res.data.user_id,
          })
        } else {
          this.setData({
            judgeStatus: false,
            authUser:false
          })
        }
      } else {
        this.setData({
          judgeStatus: false,

        })
      }
    })
  },
  onBeMemberTap: function() {
      let user = this.data.user;
      console.log('user',user);
      if(user){
          if(user.userAut){
            if(user.userAut.status == 0){
                wx.navigateTo({
                    url: '/pages/my/my-member/member-estate-auth/auth-form-res/auth-form-res?commitSuccess=1'
                })
            }
          }else{
              wx.navigateTo({
                  url: "/pages/my/my-member/member-estate-auth/estate-auth-form/estate-auth-form?village_name=" + this.data.options.village_name + "&village_id=" + this.data.options.village_id,
              })
          }
      }else{
          wx.navigateTo({
              url: "/pages/my/my-member/member-estate-auth/estate-auth-form/estate-auth-form?village_name=" + this.data.options.village_name + "&village_id=" + this.data.options.village_id,
          })
      }
  },
  applyCompany: function() {
    var loginStatus = wx.getStorageSync("loginStatus");
    if (loginStatus == true) {
      wx.navigateTo({
        url: "/pages/becomeCompany/becomeCompany",
      })
    } else {
      wx.navigateTo({
        url: "/pages/login/login?judgeLogin=1",
      })
    }
  },
  //调起用户授权
  getUser: function(e) {
    let that = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
      wx.setStorageSync('avatarUrl', e.detail.userInfo.avatarUrl);
      wx.setStorageSync('nickName', e.detail.userInfo.nickName);
      wx.setStorageSync('encrypted', e.detail);
      that.setData({
        show_modal: false,
      })
      _login.getToken().then((res) => {
        console.log(res);
        that.applyVIP();
      });
    }
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
    return {
      path: "pages/my/my-member/member-intro/member-intro?village_name=" + this.data.village_name + "&village_id=" + this.data.village_id + "&id=" + this.data.id + "&shareType=" + 1,
      success: function(res) {
        _base.showToast('分享成功', 'success');
      },
      fail: function(res) {
        // _base.showToast('取消分享');
      }
    }
  }
})
