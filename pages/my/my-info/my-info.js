import { Base } from '../../../utils/base.js';
import { Api } from '../../../utils/api.js';
var _base = new Base();
var _api = new Api();
Page({
  data: {
    loadingSubmit:false,
    default_icon:"",
    name:"",
    mobile:"",
    phone:"",
    status:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
  },
  //判断认证状态
  wonerAttestation: function () {
    console.log(this.data.userAutDTO,"aaa")
    if (this.data.status == 0 && this.data.userAutDTO.length>=1){
      wx.navigateTo({
        url: '/pages/my/my-member/member-estate-auth/auth-form-res/auth-form-res',
      })
    } else if (this.data.status == 0 && this.data.userAutDTO.length == 0){
      wx.navigateTo({
        url: '/pages/my/my-member/member-estate-auth/estate-auth-form/estate-auth-form',
      })
    }
  },
  rendering_info(res){
    console.log(res,"啊哈哈哈");
    this.setData({
      userAutDTO: res.data.userAutDTO
    })
    let nickName = wx.getStorageSync("nickName");
    let avatarUrl = wx.getStorageSync("avatarUrl");
    wx.setStorageSync('reqIcon', res.data.icon);
    if (!res.data.icon){
      this.setData({
        default_icon: avatarUrl
      })
    }else{
      this.setData({
        default_icon: res.data.icon
      })
    }

    if (!res.data.user_name) {
      this.setData({
        name: nickName
      })
    } else {
      this.setData({
        name: res.data.user_name
      })
    }
    let phone = res.data.mobile;
    var mphone = phone.substr(0, 3) + '****' + phone.substr(7);
    this.setData({
      mobile: mphone,
      phone: phone,
      status: res.data.status
    })
  },
  // 会员码
  loginCode: function() {
    console.log(111)
    _api.diffState(res => {
      console.log(res)
      console.log(22)
      // 用户会员信息
      let userInfo = res.data.userInfo
      console.log(userInfo)
      if (!userInfo) {
        _base.showToast('请先登录！', 'none', '1000')
      }
      if (!userInfo.userAut) {
        wx.showModal({
          title: "",
          content: '您还未成为多让认证业主！',
          showCancel: true,
          confirmText: '立即认证',
          confirmColor: "#E94816",
          success: function (res) {
            if (res.confirm) {
              // 认证页面
              wx.navigateTo({
                url: '/pages/my/my-member/member-estate-auth/estate-auth-form/estate-auth-form'
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
              return false
            }
          }
        })
      }
      // 判断用户是否是会员
      if (userInfo.userAut.member_auth_status == 1 || userInfo.userAut.member_auth_status == 2) {
        console.log('isMember')
        wx.navigateTo({
          url: '/pages/my/my-auth-code/my-auth-code',
        })
      } else {
        // 判断用户是否认证
        // 未认证
        if (userInfo.userAut.status == -1) {
          wx.showModal({
            title: "",
            content: '您还未成为多让认证业主！',
            showCancel: true,
            confirmText: '立即认证',
            confirmColor: "#E94816",
            success: function (res) {
              if (res.confirm) {
                // 会员码
                wx.navigateTo({
                  url: '/pages/my/my-member/member-estate-auth/estate-auth-form/estate-auth-form'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
                return false
              }
            }
          })
        } else if (userInfo.userAut.status == 0) {
          // 审核中
          wx.showToast({
            title: '认证业主正在审核中,请耐心等待审核通过',
            icon: 'none',
            duration: 1000
          })
        } else {
          // 已经是认证业主了
          // 未支付会员费
          if (userInfo.userAut.pay_status == 0) {
            // 未激活
            if (userInfo.userAut.is_activate == 0) {
              //计算时间
              const NowDate = new Date()
              const today = NowDate.toLocaleDateString()
              var date2 = new Date(NowDate);
              date2.setDate(NowDate.getDate() + 30);
              const endDay = date2.getFullYear() + "年" + (date2.getMonth() + 1) + "月" + date2.getDate() + "日";
              console.log(endDay)
              wx.showModal({
                title: '',
                content: `你有30天的体验会员资格，如果激活，体验有效期到${endDay}结束，是否现在就激活？`,
                showCancel: true,
                confirmText: '立即激活',
                confirmColor: "#E94816",
                success: function (res) {
                  if (res.confirm) {
                    // 激活
                    _api.activationCode(res => {
                      if (res.resultCode == 1000) {
                        wx.showToast({
                          title: '激活会员成功!',
                          duration: 2000,
                          success: function () {
                            wx.navigateTo({
                              url: '/pages/my/my-auth-code/my-auth-code',
                            })
                          }
                        })
                      }
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                    return false
                  }
                }
              })
              // 已经激活了体验会员(计算是否过期)
            } else {
              var date = new Date(userInfo.userAut.end_at.replace(/-/g, '/'));
              var timestamp = Date.parse(new Date());
              // 已过期
              if (timestamp > date.getTime()) {
                wx.showModal({
                  title: '',
                  content: `您的体验会员已过期，是否开通会员？`,
                  showCancel: true,
                  confirmText: '确定',
                  confirmColor: "#E94816",
                  success: function (res) {
                    if (res.confirm) {
                      // 跳转到会员页面
                      wx.navigateTo({
                        url: '/pages/becomeMember/becomeMember?id=' + userInfo.userAut.id + '&village_id=' + userInfo.villageInfo.id
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                      return false
                    }
                  }
                })
              } else {
                wx.navigateTo({
                  url: '/pages/my/my-auth-code/my-auth-code',
                })
              }
            }
          }
        }
      }
    })
  },

  wxLogin(e){
        let data = e.detail.encryptedData;
        let iv = e.detail.iv;
        let that = this;
        if(e.detail.errMsg === "getPhoneNumber:ok") {
            _api.wxLogin({data:data,iv:iv},res=>{
                if(res.resultCode===1000){
                    that.setData({
                        count_user: res.data.loginUser,
                        noLogin: false
                    });
                }
            })
        }else{
            let s = this.data.show;
            let m = this.data.mask;
            this.setData({
                showLogin:!s
            })
            setTimeout(()=>{
                this.setData({
                    mask:!m
                })
            },10)
        }
    },

  onLogoutTap: function () {
    _api.exitLogin((res)=>{
      console.log('退出登录',res);
      this.setData({
        loadingSubmit: true
      });
    setTimeout(()=>{
      wx.setStorageSync('loginStatus',false);
      wx.removeStorageSync('loginUser');
      wx.setStorageSync('scopeUserInfo', false);
      wx.removeStorageSync('scopeUserInfo');
      this.setData({
        loadingSubmit: false
      });
      let ids = wx.getStorageSync('id').val;
      if(ids!==undefined){
          for(let o of ids){
              wx.setStorageSync(o,{val:null});
          }
      }
      wx.setStorageSync('id',{val:[]});
      wx.switchTab({
        url: '/pages/my/center/center',
      })
    }, 600);
    })
  },

  onChangeAvatar: function (event) {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        wx.uploadFile({
          url: _base.baseRequestUrl + 'file/upload' + '.json',
          name: 'file',
          filePath: tempFilePaths[0],
          success: function (res) {
            let icon = JSON.parse(res.data).data
            console.log(icon);
            _this.update_icon(icon);
          }, fail: function (error) {
            console.log(error);
          }
        })
      }
    })
  },
  update_icon(icon){
    console.log(icon);
    _api.update_icon(icon,(res) => {
      this.setData({
        default_icon: icon
      })
      // _base.showToast('修改成功','success')
    })
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
    _api.my_info((res) => {
      console.log(res);
      this.rendering_info(res);
    })
    let pages = getCurrentPages()
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
