const app = getApp()
import { Base } from 'base.js';
import { Api } from 'api.js';
var _base = new Base();
var _api = new Api();

class login {

  login() {
    return new Promise(resolve => {
      let that = this;
      let sessionId = wx.getStorageSync("sessionId");

      console.log(sessionId,"sessionIdsessionIdsessionIdsessionId")
      let token = wx.getStorageSync("token");
      if (sessionId == '' || token=='') {
        console.log('token肯沒了',resolve);
        that.wxLogin(resolve);
      } else {
        //通过接口测试后台的token过期没
        wx.request({
          url: _base.baseRequestUrl + 'userinfo/checkSession.json?',
          data: {
            sessionId: sessionId,
          },
          header: {
            'content-type': 'application/json'
          },
          method: 'GET',
          success: function (res) {
            console.log('checkSession',res);
            if (res.data.resultCode == 1000) {
              if (res.data.data == true) {
                wx.hideLoading()
                resolve("loginisok");
              } else {
                console.log('resolve1',resolve);
                that.wxLogin(resolve);
                console.log('wxLoginsuccess');
              }
            } else {
              console.log(res.data.error, 1113)
              wx.showToast({
                icon: 'none',
                title: String(res.data.error)
              })
            }
          }
        })
      }
    });
  }
  //微信登录2
  wxLogin2(callback) {
      let that = this;
      wx.login({
          success: res => {
            that.buildSession2(res, res => {
              typeof callback == "function" && callback(res)
            });
            
          }
      })
  }

  buildSession2(res,callback) {
        let that = this;
        wx.request({
            url: _base.baseRequestUrl + 'userinfo/buildSessionByCode.json',
            data: {
                code: res.code,
            },
            header: {
                'content-type': 'application/json'
            },
            method: 'GET',
            success: (res) => {
                console.log('build',res);
                console.log('builduser',res.data.data);
                var obj = res.data.data.loginUser;
                if (res.data.resultCode == 1000) {
                    wx.setStorageSync('sessionId', res.data.data.sessionId);
                    wx.setStorageSync('token', res.data.data.token);
                    wx.setStorageSync('tokenid', res.data.data.tokenid);
                    wx.setStorageSync('loginStatus', res.data.data.loginstatus);
                    wx.setStorageSync('loginUser', obj);

                  // if (userId){
                  //   console.log(`%c 阿文提醒您，分享者的用户ID为：${userId}`, `color:#f00;font-weight:bold;`)
                  //   _api.updateInvite(userId, res => {
                  //     console.log(res, "刘博文")
                  //   })
                  // }
                  
                } else {
                    if (!res.data.error) {
                        wx.showToast({
                            icon: 'none',
                            title: "请联系管理员"
                        })
                    } else {
                        console.log(res.data.error, 1115)
                        wx.showToast({
                            icon: 'none',
                            title: String(res.data.error)
                        })
                    }
                }
            },
            fail: function () {
                wx.showToast({
                    icon: 'none',
                    title: "接口调用失败"
                })
            }
        })
    }

  wxLogin(resolve) {
    let that = this;
    wx.login({
      success: res => {
        that.buildSession(res, resolve);
      }
    })
  }
  buildSession(res, resolve) {
    console.log('res.code:', res.code)
    let that = this;
    wx.request({
      url: _base.baseRequestUrl + 'userinfo/buildSessionByCode.json',
      data: {
        code: res.code,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: (res) => {
        console.log('buildSessionByCode返回:',res);
          var obj = res.data.data.loginUser;
        if (res.data.resultCode == 1000) {
          wx.setStorageSync('sessionId', res.data.data.sessionId);
          wx.setStorageSync('token', res.data.data.token);
          wx.setStorageSync('tokenid', res.data.data.tokenid);

          wx.setStorageSync('loginStatus', res.data.data.loginstatus);
          wx.setStorageSync('loginUser', obj);
          resolve('loginisnot');
          
        } else {
          if (!res.data.error) {
            wx.showToast({
              icon: 'none',
              title: "请联系管理员"
            })
          } else {
            console.log(res.data.error, 1115)
            wx.showToast({
              icon: 'none',
              title: String(res.data.error)
            })
          }
        }
      },
      fail: function () {
        wx.showToast({
          icon: 'none',
          title: "接口调用失败"
        })
      }
    })
  }
  getToken(nickName, avatarUrl) {
    return new Promise(resolve => {
    let that = this;
    var {encryptedData,iv} = wx.getStorageSync('encrypted');
    
    var encrypted = {
      encryptedData,
      iv,
      sessionId : wx.getStorageSync('sessionId'),
      nickName : nickName || '',
      avatarUrl : avatarUrl || ''
     } 
     console.log("encrypted:", encrypted)
    wx.request({
      url: _base.baseRequestUrl + '/userinfo/modifyNickNameLoginByEncryptedData.json',
      data: encrypted,
      method: 'GET',
      success: function (res) {
        console.log(res,111);
          var obj = res.data.data.loginUser?res.data.data.loginUser:''
        if (res.data.resultCode == 1000) {
            wx.setStorageSync('token', res.data.data.token);
            wx.setStorageSync('tokenid', res.data.data.tokenid);
            wx.setStorageSync('loginStatus', res.data.data.loginstatus);
            wx.setStorageSync('loginUser', obj);
            resolve("tokenisok");
        }else if(res.data.resultCode == 1005){
           console.log(res.data.error,"res.data.error")
            wx.setStorageSync('token', res.data.data.token);
            wx.setStorageSync('tokenid', res.data.data.tokenid);
            wx.showToast({
                icon: 'none',
                title: String(res.data.error)
            })
        }else {
          console.log(res.data.error, 11116)
          wx.showToast({
            icon: 'none',
            title: String(res.data.error)
          })
        }
      }
    })
    })
  }
}
export { login };
