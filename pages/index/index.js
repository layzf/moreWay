//index.js
//获取应用实例
const app = getApp()
import { Base } from '../../utils/base.js';
import { Api } from '../../utils/api.js';
import { login } from '../../utils/login.js';
var _base = new Base();
var _api = new Api();
var _login = new login();
Page({
  data: {
    //show_modal: false
    scene:null
  },
  onLoad: function (options) {
    let scene = decodeURIComponent(options.scene);
    let obj = {};
    if(scene !== 'undefined'){
        let temp = scene.split('&');
        console.log('temp2',temp);
        obj.baseId = temp[1].split('=')[1];
        obj.ridingId = temp[0].split('=')[1];
        this.setData({
            scene:obj
        })
    }
  },
  onShow: function () {
    wx.getSetting({
      success(res) {
        console.log(res.authSetting)
      }
    })
    var that = this;
      let scene = this.data.scene;
      _login.login().then((res) => {

        if (res == "loginisnot") {
              wx.getUserInfo({
                  success: function (res) {
                      wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl);
                      wx.setStorageSync('nickName', res.userInfo.nickName);
                      wx.setStorageSync('encrypted', res);

                      setTimeout(res => {
                        console.log(scene,"scene")
                          if(scene){
                              wx.reLaunch({
                                  url: '/pages/r-login/login?isCode=true&data='+JSON.stringify(scene)
                              })
                          }else{
                              wx.reLaunch({
                                  url: '/pages/group/group?village_id=' + 22
                              })
                          }
                      }, 500)
                  },
                  fail:function() {
                    wx.reLaunch({
                      url: '/pages/group/group?village_id=' + 22
                    })
                  }
              })
        }
        if (res == "loginisok") {
      
            if(scene){
              let user = wx.getStorageSync('loginUser');
              let d = {
                baseId:scene.baseId,
                ridingId:scene.ridingId,
                uid:user.id
              }
              console.log(d,"aaaa")
              _api.isSignIn(d,resd=>{
                console.log('扫码返回',resd);
                if(resd.resultCode===1000){
                    wx.reLaunch({
                        url: '/pages/r-success/success?success=true'
                    })
                }else if(resd.resultCode === 1004){
                    wx.reLaunch({
                        url: '/pages/r-main/main?data='+JSON.stringify(d)
                    })
                }else if(resd.resultCode === 1002){
               
                    wx.reLaunch({
                        url: '/pages/r-login/login?data='+JSON.stringify(d)+'&isCode=1'
                    })
                }else{
                    wx.reLaunch({
                        url: '/pages/r-success/success?success=false'
                    })
                }
              })
            }else{
                wx.reLaunch({
                    url: '/pages/group/group?village_id=' + 22
                })
            }
        }
      });
  },
 
})
