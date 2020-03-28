
//Creating a new branch is quick AND simple.


import {
  Base
} from './utils/base.js';
import {
  Api
} from './utils/api.js';
import {
    login
} from './utils/login.js';
var _base = new Base();
var _api = new Api();
var _login = new login();
const app = getApp();
App({
    onLaunch: function (options) {
      
//金雕二维码ID
      if (options.query.qrUserId){
        this.globalData.qrUserId = options.query.qrUserId
      }
        if (options.scene == 1007 || options.scene == 1008) {
            this.globalData.share = true
        } else {
            this.globalData.share = false
        };
        //获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
        //这个最初我是在组件中获取，但是出现了一个问题，当第一次进入小程序时导航栏会把
        //页面内容盖住一部分,当打开调试重新进入时就没有问题，这个问题弄得我是莫名其妙
        //虽然最后解决了，但是花费了不少时间
        wx.getSystemInfo({
            success: (res) => {
                this.globalData.height = res.statusBarHeight
            }
        })

        var that = this
        // 全局判断是否存在session
        
        wx.checkSession({
            success() {
              _login.login(); 
              // let sessionId = wx.getStorageSync("sessionId");
              //  if (!sessionId){
              //    _login.login();         console.log("session_key没过期但session没了")
              //   }else{
              //      console.log("session_key没过期，并且有session 正常访问")
              //   }
            },
            fail() {
              console.log('session_key过期123')
                // session_key 已经失效，需要重新执行登录流程
                _login.login();
            }
        })

  

        // 强制用户更新小程序
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function(res) {
            // 请求完新版本信息的回调
        })

        updateManager.onUpdateReady(function() {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function(res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })
        })

        updateManager.onUpdateFailed(function() {
            // 新的版本下载失败
        })
    },
  globalData: {
    qrUserId:'',
    userInfo: null,
    l:"哈哈哈哈哈哈",
    show: false,
    show_modal: false,
    share: false,  // 分享默认为false
    height: 0,
    userId:'',//用户id
  },
  groupEstatePara: {

  },
  getHismessage(callBack) {
    _api.getHisvillage((res) => {
      if (res.resultCode == 1000) {
        callBack(res);
      } else {
        if (!res.data.error) {
          wx.showToast({
            icon: 'none',
            title: "请联系管理员"
          })
        } else {
          console.log(res.data.error, 1112)
          wx.showToast({
            icon: 'none',
            title: String(res.data.error)
          })
        }
      }
    })
  },
  //判断跳转
  judge() {
    let token = wx.getStorageSync('token');
    let tokenid = wx.getStorageSync('tokenid');
    let loginStatus = wx.getStorageSync('loginStatus');
    let loginUser = wx.getStorageSync('loginUser');
    _api.diffState((res) => {
      if (res.data.user_id != null) {
        var obj = res.data.userInfo;
        console.log(obj,33333)
        if (obj.userAut != null) {
          wx.reLaunch({
            url: '/pages/group/group?village_id=' + obj.villageInfo.id
          })
        } else if (obj.villageApply != null) {
          if (obj.villageApply.status == 1) {
            wx.reLaunch({
              url: '/pages/group/group?village_id=' + obj.villageInfo.id
            })
          } else {
            this.getHismessage(function(res) {
              var Id = res.data;
              if (Id == null) {
                wx.reLaunch({
                  url: '/pages/estate/choose-estate'
                })
              } else {
                wx.reLaunch({
                  url: '/pages/group/group?village_id=' + Id
                })
              }
            })
          }
        } else {
          this.getHismessage(function(res) {
            var Id = res.data;
            if (Id == null) {
              wx.reLaunch({
                url: '/pages/estate/choose-estate'
              })
            } else {
              wx.reLaunch({
                url: '/pages/group/group?village_id=' + Id
              })
            }
          })
        }
      } else {
        wx.redirectTo({
          url: '/pages/estate/choose-estate'
        })
      }
    })
  },
  loginCode: function(callBack) {
    _api.diffState((res) => {
      var obj = res.data.userInfo;
      if (obj != null) {
        if (obj.userAut != null) {
          if (obj.userAut.status == 0) {
            _base.showToast("会员正在审核", 'loading', 1000, function() {
              setTimeout((res) => {
                wx.navigateTo({
                  url: '/pages/my/my-member/member-home/my-member'
                })
              }, 1000)
            });
          } else if (obj.userAut.status == -1) {
            _base.showToast("会员审核失败", 'loading', 1000, function() {
              setTimeout((res) => {
                wx.navigateTo({
                  url: '/pages/my/my-member/member-estate-auth/auth-form-res/auth-form-res?fail=1'
                })
              }, 1000)
            });
          } else if (obj.userAut.status == 1 && obj.userAut.pay_status == 0) {
            //体验会员的逻辑
            var timestamp = Date.parse(new Date());
            if (obj.userAut.is_activate == 0) {
              _base.showToast("请激活成为体验会员", 'none', 1000, function() {
                setTimeout((res) => {
                  wx.navigateTo({
                    url: '/pages/my/my-member/member-home/my-member'
                  })
                }, 1000)
              });
            } else {
              var date = new Date(obj.userAut.end_at.replace(/-/g, '/'));
              var timestamp = Date.parse(new Date());
              if (timestamp > date.getTime()) {
                wx.navigateTo({
                  url: '/pages/becomeMember/becomeMember?id=' + obj.userAut.id + '&village_id=' + obj.villageInfo.id
                })
              } else {
                callBack();
              }
            }
          } else {
            callBack();
          }
        } else if (obj.villageApply != null) {
          if (obj.villageApply.status == 0) {
            _base.showToast("团长正在审核", 'loading', 1000, function() {
              setTimeout((res) => {
                wx.navigateTo({
                  url: '/pages/my/my-member/member-home/my-member'
                })
              }, 1000)
            });
          } else if (obj.villageApply.status == -1) {
            _base.showToast("团长审核失败", 'loading', 1000, function() {
              setTimeout((res) => {
                wx.navigateTo({
                  url: '/pages/my/my-member/member-home/my-member'
                })
              }, 1000)
            });
          } else {
            callBack();
          }
        } else {
          _base.showToast('请认证为会员', 'loading', 1000, function() {
            setTimeout((res) => {
              wx.navigateTo({
                url: '/pages/my/my-member/member-estate-auth/estate-auth-form/estate-auth-form'
              })
            }, 1000)
          })
        }
      } else {
        _base.showToast("请先登录", 'none', 1000, function() {
          setTimeout((res) => {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }, 1000)
        });
      }
    })
  },
  // 将日期转换成时间戳
  times: function(str) {
    var data = new Date(str.replace(/-/g, '/'));
    var time2 = data.getTime();
    return time2;
  },
  // 时间转换成月日时间
  timestampToTime: function(timestamp) {
    var date = new Date(timestamp),
      Mouth = (date.getMonth() + 1) + '月',
      datas = date.getDate() + '日',
      hours = date.getHours() + ':',
      minute = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes())
    return Mouth + datas + " " + hours + minute;
  },
  //当前时间 + 3个月
  getNextMonth: function (date) {
    var arr = date.split('-');
    var year = arr[0]; //获取当前日期的年份  
    var month = arr[1]; //获取当前日期的月份  
    var day = arr[2]; //获取当前日期的日  
    var days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中的月的天数  
    var year2 = year;
    var month2 = parseInt(month) + 3;

    if (month2 == 13) {
      year2 = parseInt(year2) + 1;
      month2 = 1;
    }
    if (month2 == 14) {
      year2 = parseInt(year2) + 1;
      month2 = 2;
    }
    if (month2 == 15) {
      year2 = parseInt(year2) + 1;
      month2 = 3;
    }

    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
      day2 = days2;
    }
    if (month2 < 10) {
      month2 = '0' + month2;
    }

    var t2 = year2 + '-' + month2 + '-' + day2;
    return t2;
  },
  //图片放大
  previewImage: function (Imgarr, index){
    wx.previewImage({
      urls: Imgarr,
      current: Imgarr[index]
    })
  },

  
  // 被邀请人进入邀请函
  updateref_user: function(id) {
    _api.updateref_user(id, (res) => {
    })
  },
  //报名人是否填写楼栋判断
  comeToJoin: function(user_name, link_mobile, activity_project_ids, writeNone, img_url) {
    _api.allJoinlist(user_name, link_mobile, activity_project_ids, writeNone, (res) => {
      if (res.resultCode == 1000) {
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/collect/result-submit/result-submit?collectId=' + activity_project_ids + '&img_url=' + img_url + '&judgeResult=1',
          })
        }, 500);
      }
    })
  },
  comeToPreview: function(user_name, link_mobile, checkId, writeNone, villageId, listImg, base_id) {
    _api.allJoinlist(user_name, link_mobile, checkId, writeNone, (res) => {
      if (res.resultCode == 1000) {
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/collect/result-submit/result-submit?base_id=' + base_id + '&villageId=' + villageId + '&img_url=' + listImg
          })
        }, 500);
      }
    })
  },
  globalData: {
    // GLBUrl: 'https://192.168.0.116:8082',
    GLBUrl: 'http://182.61.36.33:12042/',
    imgUrl: 'https://sxhwxapi.jufangbian.com/dist', // 全局图片服务器地址
    third_ap_id: '385',
  }
})
