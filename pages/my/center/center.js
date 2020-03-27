import { Base } from '../../../utils/base.js';
import { Api } from '../../../utils/api.js';
import { login } from '../../../utils/login.js';
var _base = new Base();
var _login = new login();
var _api = new Api();
const app = getApp();
Page({
  data: {
    codeImgs:'',//会员码
    codeImgsHidden:false,//会员码隐藏
 
    autTure:true,
    count_user:'',
    noLogin:false,
    mallTime:false,
    showData:false,
    masks:false,
    loginUser:'',
    wxlogin: false,//执行手机号获取

/**子组件myCommander**/
    showTab: Boolean,
    height:'', //设备高度
    commanderHiden:false,

    /**load**/
    load:true
  },

  onLoad: function (options) {
      let h = wx.getSystemInfoSync().windowHeight;
      console.log(h);
      this.setData({
          height:h
      })
  },


//我的团长
  support:function(){
    let h = wx.getSystemInfoSync().windowHeight;
    this.selectComponent('#my-commander').getInfo()
    this.setData({
      height: h,
      commanderHiden:true,
      showTab:false
    })
  },
//隐藏登录
  hideRowLogin(e){
    this.selectComponent("#tip").showLogin(); //登录时候判断是否显示订部认证信息
    this.setData({
        showData:false,
        noLogin:e.detail.hiddens,
        loginUser: e.detail.user 
      })
  },

  onShow: function (event) {
    var that=this;
    let loginStatus = wx.getStorageSync('loginStatus'); //登录状态
 
    _api.diffState((res) => {
      if (res.data && res.data.user_id!=null){
        var obj = res.data.userInfo;
          if (obj.spreadIdentity == 1)
              this.setData({
                count_user: res.data.count_user
              })
        if (obj.userAut != null){
          if (obj.userAut.is_activate == 1) {
            var date = new Date(obj.userAut.end_at.replace(/-/g, '/'));
            var time2 = date.getTime();
            var timestamp = Date.parse(new Date());
            if (timestamp > time2) {
              this.setData({
                mallTime: true
              })
            }
          }
        }
        this.setData({
          loginUser: res.data.userInfo,
          noLogin: false,
          load: false
        });
      }else{
        if(!this.data.wxlogin){
          this.setData({
              showData:false,
              masks:false
          })
        }
        this.setData({
          noLogin:true,
          load: false
        })   
      }
    })
 
  },
  auditMmember(){
    wx.navigateTo({
      url: '../../auditMmember/member_list/member_list',
    })
  },
  //查看会员权益
  inviolable(){
    let user = this.data.count_user?this.data.count_user:this.data.loginUser

    if(user.userAut && user.userAut.status === 0){
        wx.navigateTo({
            url: '/pages/my/my-member/member-intro/member-intro?type=1'
        })
    }else{
        wx.navigateTo({
            url: '/pages/my/my-member/member-intro/member-intro'
        })
    }
  },


//关闭会员码弹框
  hidenCommander(){
    this.setData({
      codeImgsHidden: false
    })
  },
  //查看会员码大图
  lookImg: function () {
    wx.previewImage({
      urls: [this.data.codeImgs],
      current: this.data.codeImgs, // 当前显示图片的http链接
    })
  },
  //加载会员码
  loginCode: function () {
    var that = this;
    _api.diffState(res => {
      console.log(res)
      // 用户会员信息
      let userInfo = res.data?res.data.userInfo:{}

      if (!userInfo) {
        _base.showToast('请先登录！', 'none', '1000')
      }
      // wx.navigateTo({
      //     url: '/pages/my/my-auth-code/my-auth-code',
      // })


      let token = wx.getStorageSync("token");
      let tokenid = wx.getStorageSync("tokenid");
      wx.downloadFile({
        url: _base.baseRequestUrl + 'usercode/getUserCode.json?token=' + token + '&tokenid=' + tokenid,
        success: function (res) {
          console.log(res);
          that.setData({
            codeImgs: res.tempFilePath,
            codeImgsHidden:true
          })
        }
      })


      
      // if (!userInfo.userAut) {
      //   wx.showModal({
      //     title: "",
      //     content: '您还未成为多让认证业主！',
      //     showCancel: true,
      //     confirmText: '立即认证',
      //     confirmColor: "#E94816",
      //     success: function (res) {
      //       if (res.confirm) {
      //         // 认证页面
      //         wx.navigateTo({
      //           url: '/pages/my/my-member/member-estate-auth/estate-auth-form/estate-auth-form'
      //         })
      //         return false
      //       } else if (res.cancel) {
      //         console.log('用户点击取消')
      //         return false
      //       }
      //     }
      //   })
      // } else {
      //  // 判断用户是否是会员
      //   if (userInfo.userAut.member_auth_status) {
      //     console.log(222)
      //     console.log(userInfo.userAut.member_auth_status)
      //     if (userInfo.userAut.member_auth_status == 1 || userInfo.userAut.member_auth_status == 2) {
      //       wx.navigateTo({
      //         url: '/pages/my/my-auth-code/my-auth-code',
      //       })
      //     }
      //   } else {
      //     // 判断用户是否认证
      //     // 未认证
      //     if (userInfo.userAut.status == -1) {
      //       wx.showModal({
      //         title: "",
      //         content: '您还未成为多让认证业主！',
      //         showCancel: true,
      //         confirmText: '立即认证',
      //         confirmColor: "#E94816",
      //         success: function (res) {
      //           if (res.confirm) {
      //             // 会员码
      //             wx.navigateTo({
      //               url: '/pages/my/my-member/member-estate-auth/estate-auth-form/estate-auth-form'
      //             })
      //           } else if (res.cancel) {
      //             console.log('用户点击取消')
      //             return false
      //           }
      //         }
      //       })
      //     } else if (userInfo.userAut.status == 0) {
      //       // 审核中
      //       wx.showToast({
      //         title: '认证业主正在审核中,请耐心等待审核通过',
      //         icon: 'none',
      //         duration: 1000
      //       })
      //     } else {
      //       // 已经是认证业主了
      //       // 未支付会员费
      //       if (userInfo.userAut.pay_status == 0) {
      //         // 未激活
      //         if (userInfo.userAut.is_activate == 0) {
      //           //计算时间
      //           const NowDate = new Date()
      //           const today = NowDate.toLocaleDateString()
      //           var date2 = new Date(NowDate);
      //           date2.setDate(NowDate.getDate() + 30);
      //           const endDay = date2.getFullYear() + "年" + (date2.getMonth() + 1) + "月" + date2.getDate() + "日";
      //           console.log(endDay)
      //           wx.showModal({
      //             title: '',
      //             content: `你有30天的体验会员资格，如果激活，体验有效期到${endDay}结束，是否现在就激活？`,
      //             showCancel: true,
      //             confirmText: '立即激活',
      //             confirmColor: "#E94816",
      //             success: function (res) {
      //               if (res.confirm) {
      //                 // 激活
      //                 _api.activationCode(res => {
      //                   if (res.resultCode == 1000) {
      //                     wx.showToast({
      //                       title: '激活会员成功!',
      //                       duration: 2000,
      //                       success: function () {
      //                         wx.navigateTo({
      //                           url: '/pages/my/my-auth-code/my-auth-code',
      //                         })
      //                       }
      //                     })
      //                   }
      //                 })
      //               } else if (res.cancel) {
      //                 console.log('用户点击取消')
      //                 return false
      //               }
      //             }
      //           })
      //           // 已经激活了体验会员(计算是否过期)
      //         } else {
      //           var date = new Date(userInfo.userAut.end_at.replace(/-/g, '/'));
      //           var timestamp = Date.parse(new Date());
      //           // 已过期
      //           if (timestamp > date.getTime()) {
      //             wx.showModal({
      //               title: '',
      //               content: `您的体验会员已过期，是否开通会员？`,
      //               showCancel: true,
      //               confirmText: '确定',
      //               confirmColor: "#E94816",
      //               success: function (res) {
      //                 if (res.confirm) {
      //                   // 跳转到会员页面
      //                   wx.navigateTo({
      //                     url: '/pages/becomeMember/becomeMember?id=' + userInfo.userAut.id + '&village_id=' + userInfo.villageInfo.id
      //                   })
      //                 } else if (res.cancel) {
      //                   console.log('用户点击取消')
      //                   return false
      //                 }
      //               }
      //             })
      //           } else {
      //             wx.navigateTo({
      //               url: '/pages/my/my-auth-code/my-auth-code',
      //             })
      //           }
      //         }
      //       }
      //     }
      //   }
      // }
    })
  },

  contactTel:function(){
    wx.makePhoneCall({
      phoneNumber: '15629083308' //仅为示例，并非真实的电话号码
    })
  },

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {
    let obj = {
      title: '多让业主集采，比普通团购再省10%-30%',
      img: '../../../images/share.jpg',
      url: "pages/my/center/center"
    }
    console.log('分享', obj);
    return _base.shareData(obj);
  }
 
})
