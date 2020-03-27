import { Base } from '../../../utils/base.js';
import { Api } from '../../../utils/api.js';
import { login } from '../../../utils/login.js';
var _base = new Base();
var _api = new Api();
var _login = new login();
const app = getApp();
Page({
  data: {
    date: '',
    appointTap: false,
    animationData: {},
    showShareModal: false,
    pageStatus: '',
    collectId: '',
    isLogin:false,
    isSub:false,
    collectRecordDto: null,
    collectComment: [],
    collectTable: [],
    lastComment: 0,
    isMore: false,
    canUse:true,
    chooseContactBack: '',
    chooseMessage: '',
    collectDespoit: '',
    beg_at: false,
    end_at: false,
    end_detail: false,
    progressList: '',
    options: '',
    showMore: false,
    returnIndex: false,
    nickName: '',
    showRoom: true,
    height:0,
    showLogin:false,
    mask:false,
    info:{},
    show:false,
    masks:false,
    addrList:[],
    scanCode:true,
    shareHome:false
  },

  onLoad: function(options) {
    console.log('options',options);
    let that = this;
    _login.wxLogin2();
    let scene = decodeURIComponent(options.scene);
    let obj = {};
    if(scene !== 'undefined'){
        let temp = scene.split('&');
        obj.collectId = temp[0].split('=')[1];
        obj.villageId = temp[1].split('=')[1];
        options = obj;
        this.setData({
            shareHome:true
        })
    }
      wx.getSetting({
          success(res) {
              console.log('授权状态',res.authSetting)
              if(res.authSetting['scope.userInfo']){
                  let state = wx.getStorageSync('loginStatus');
                  console.log('loginstate',state);
                  if(!state){
                      _login.getToken().then(res=>{
                          let state = wx.getStorageSync('loginStatus');
                          let user = wx.getStorageSync('loginUser');
                          if(state){
                              that.setData({
                                  isLogin:true,
                                  collectDespoit:user
                              })
                          }else{
                              that.setData({
                                  isLogin:false
                              })
                          }
                      })
                  }else{
                      let user = wx.getStorageSync('loginUser');
                      that.setData({
                          isLogin:true,
                          collectDespoit:user
                      })
                  }
              }else{
                  that.setData({
                      loginData: {
                          show_modal: true,
                          height:wx.getSystemInfoSync().windowHeight
                      },
                  })
              }
          }
      })
    let id = options.collectId;
    _api.progressDetail(id, res => {
        that.setData({
             addrlist:res.data.ridingList
          })
      });
    this.setData({
        collectId: options.collectId,
        options: options
    })
      console.log('userData',that.data.collectRecordDto);
  },
    //隐藏
    hideRow(e){
        this.setData({
            mask:false
        })
        setTimeout(()=>{
            this.setData({
                showLogin:false
            })
        },300)
    },

    //隐藏登录
    hideRowLogin(){
        this.setData({
            masks:false
        })
        setTimeout(()=>{
            this.setData({
                show:false
            })
        },300)
    },
    returnHome(){
        wx.reLaunch({
            url: '/pages/group/group?village_id=22'
        })
    },
    //交定金
    wxLoginGold(e){
        let that = this;
        let data = e.detail.encryptedData;
        let iv = e.detail.iv;
        let collectId = this.data.collectId;
        if(e.detail.errMsg === "getPhoneNumber:ok") {
            _api.wxLogin({data:data,iv:iv},res=>{
                console.log('res',res);
                wx.setStorageSync("loginStatus", res.data.loginstatus);
                wx.setStorageSync("loginUser", res.data.loginUser);
                if(res.resultCode===1000){
                    that.setData({
                        collectDespoit:res.data.loginUser
                    })
                    _api.progressDetail(collectId, (res) => {
                        wx.hideLoading();
                        if(res.data.so_info){
                           that.changeData(res)
                        }else{
                            wx.navigateTo({
                                url: '/pages/my/my-deposit/deposit-add/deposit-add?id=' + collectId
                            })
                        }

                    });
                }else if(res.resultCode === 1005){
                    that.setData({
                        isSub:true,
                        show:true
                    })
                    setTimeout(()=>{
                        that.setData({
                            masks:true
                        })
                    },10)
                }
            })
        }else{
            this.setData({
                isSub:true,
                show:true
            })
            setTimeout(()=>{
                this.setData({
                    masks:true
                })
            },10)
        }
    },
    //登陆后更新数据
    changeData(data){
      let that = this;
        let res = data.detail?data.detail.res:data
        console.log('data',data);
        console.log('res',res);
        var time2 = app.times(res.data.dto.beg_at);
        var time4 = app.times(res.data.dto.end_at);
        var timestamp = Date.parse(new Date());
        if (timestamp > time4) {
            that.setData({
                end_detail: true
            })
        } else if (time2 < timestamp && timestamp < time4) {
            that.setData({
                end_at: true
            })
        } else {
            that.setData({
                beg_at: true
            })
        }
        res.data.dto.beg_at = app.timestampToTime(time2);
        res.data.dto.end_at = app.timestampToTime(time4);
        that.setData({
            collectRecordDto: res.data.dto,
            progressList: res.data,
        })
        that.hideRowLogin()
    },

  animate: function() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export(),
      appointTap: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  hideAppointModal: function(e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        appointTap: false
      })
    }, 200)
  },
  contactGroup: function(e) {
    var collectId = this.data.collectId;
    if (this.data.collectDespoit.userAut != null) {
      if (this.data.collectDespoit.userAut.status == 1) {
        wx.navigateTo({
          url: '/pages/my/my-commander/my-commander'
        })
      }
    } else if (this.data.collectDespoit.villageApply != null) {
      wx.navigateTo({
        url: '/pages/my/my-commander/my-commander'
      })
    } else {
      wx.makePhoneCall({
        phoneNumber: '15629083308'
      })
    }
  },
  seePrice: function(e) {
    var collectId = this.data.collectId;
    app.loginCode(function() {
      wx.navigateTo({
        url: '../price-table/price-table?collectId=' + collectId
      })
    })
  },
  alreadyGroup: function() {
    wx.navigateTo({
      url: '/pages/my/my-group/my-group-list/my-group-list'
    })
  },
  //交定金
  depositGold: function(e) {
    var collectId = this.data.collectId;
    wx.navigateTo({
      url: '/pages/my/my-deposit/deposit-add/deposit-add?id=' + collectId
    })
  },
  //跳转我的定金列表
  goToMySoInfoList() {
    app.loginCode(function() {
      wx.navigateTo({
        url: '/pages/my/my-deposit/deposit-list/deposit-list'
      })
    })
  },
  //报名
  onAppointTap: function(e) {
    var that = this;
    //弹出联系人 去报名
      let reqireCof = that.data.collectDespoit.villageInfo;
      console.log('reqireCof',reqireCof);
     //that.animate();
      that.setData({
          showLogin: true
      })
      setTimeout(()=>{
          that.setData({
              mask: true
          })
      },100)
  },
  writeNone: function(e) {
    this.setData({
      writeNone: e.detail.value
    })
  },
  onSubmitAppoint: function() {
    let that = this;
    let user_name = '';
    let link_mobile = '';
    // 登陆人信息
    if(that.data.chooseContactBack.length == 0) {
      user_name = this.data.chooseMessage.link_name;
      link_mobile = this.data.chooseMessage.link_mobile;
    } else {
      // 选择联系人
      user_name = this.data.chooseContactBack.name;
      link_mobile = this.data.chooseContactBack.phone;
    }
    console.log('user',user_name,link_mobile)
    let activity_project_ids = this.data.collectId;
    var img_url = this.data.collectRecordDto.project_img_url;
    let writeNone = this.data.writeNone;
    console.log(writeNone)
    var judgeCof = this.data.collectDespoit.villageInfo;
    if (judgeCof == null) {
      if (!writeNone) {
        _base.showToast("请填写楼栋房号", 'none');
      } else {
        app.comeToJoin(user_name, link_mobile, activity_project_ids, writeNone, img_url);
      }
    } else {
      if (judgeCof.status == 1) {
        app.comeToJoin(user_name, link_mobile, activity_project_ids, '', img_url);
      } else {
        if (!writeNone) {
          _base.showToast("请填写楼栋房号");
        } else {
          app.comeToJoin(user_name, link_mobile, activity_project_ids, writeNone, img_url);
        }
      }
    }
  },

  swiperChange: function(event) {
    if (event.detail.current + 1 === this.data.lastComment) {
      setTimeout(() => {
        this.setData({
          isMore: true
        });
      }, 300);
    } else {
      this.setData({
        isMore: false
      });
    }
  },
  getCollectDetail(collectId) {
    wx.showLoading({
      title: '加载中',
      key: true
    })
    _api.progressDetail(collectId, (res) => {
      console.log(res);
      wx.hideLoading();
      var time2 = app.times(res.data.dto.beg_at);
      var time4 = app.times(res.data.dto.end_at);
      var timestamp = Date.parse(new Date());
      if (timestamp > time4) {
        this.setData({
          end_detail: true
        })
      } else if (time2 < timestamp && timestamp < time4) {
        this.setData({
          end_at: true
        })
      } else {
        this.setData({
          beg_at: true
        })
      }
      res.data.dto.beg_at = app.timestampToTime(time2);
      res.data.dto.end_at = app.timestampToTime(time4);
      this.setData({
        collectRecordDto: res.data.dto,
        progressList: res.data
      })
        console.log('addr',this.data.progressList);
      wx.setNavigationBarTitle({
        title: res.data.dto.project_name + '门店集采'
      });
    });
  },
  contactShop: function(e) {
    var iPhone = _base.getDataSet(e, 'iPhone');
    wx.makePhoneCall({
      phoneNumber: this.data.collectRecordDto.phone
    })
  },
  // 获取人的登录身份
  reqIdentity() {
    _api.diffState((res) => {
      console.log('identity',res);
      if (res.data.user_id != null) {
        this.setData({
          collectDespoit: res.data.userInfo,
          nickName: res.data.userInfo.user_name,
        })
      } else {
        var nickName = wx.getStorageSync('nickName');
        this.setData({
          nickName: nickName
        })
      }
    })
  },
  // 获取报名人数信息
  reqNumber(collectId) {
    _api.joinCollect(collectId, (res) => {
      console.log(res);
      var hideMobile;
      var obj = res.data;
      if (obj.length > 0) {
        this.setData({
          showMore: true
        })
      }
      for (var i = 0; i < obj.length; i++) {
        hideMobile = obj[i].mobile.substr(0, 3) + "****" + obj[i].mobile.substr(7);
        obj[i].mobile = hideMobile;
      }
      this.setData({
        collectEnrolls: res.data
      })
    })
  },
  reqComment(collectId) {
    // 获取评论数据接口
    _api.reqComment(collectId, (res) => {
      console.log(res);
      var objs;
      var commentImg = res.data;
      for (var i = 0; i < commentImg.length; i++) {
        objs = commentImg[i].img_url.split(';');
        commentImg[i].img_url = objs;
      }
      this.setData({
        collectComment: res.data
      })
    })
  },
  // 分享判断跳转
  shareCollcet() {
    var that = this;
    _api.diffState((res) => {
      console.log(res);
      var obj = res.data.userInfo;
      if (res.data.user_id == null) {
        that.reqNumber(this.data.options.collectId);
        that.reqComment(this.data.options.collectId);
        that.getCollectDetail(this.data.options.collectId);
      } else {
        if (res.data.userInfo.villageInfo == null) {
          that.reqNumber(this.data.options.collectId);
          that.reqComment(this.data.options.collectId);
          that.getCollectDetail(this.data.options.collectId);
        } else {
          if (this.data.options.villageId == obj.villageInfo.id) {
            that.reqNumber(this.data.options.collectId);
            that.reqComment(this.data.options.collectId);
            that.getCollectDetail(this.data.options.collectId);
          } else {
            that.reqNumber(this.data.options.collectId);
            that.reqComment(this.data.options.collectId);
            that.getCollectDetail(this.data.options.collectId);
          }
        }
      }
      this.setData({
        collectDespoit: res.data.userInfo,
        reqId: res.data.user_id
      })
    })
  },
  returnPage: function() {
    setTimeout(obj => {
      wx.reLaunch({
        url: '/pages/group/group?village_id=' + this.data.options.villageId
      })
    }, 300)

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  showLoginData(res){
    console.log('loginres',res);
    let that = this;
      that.setData({
          collectDespoit:res.detail.user
      })
      that.setData({
          isLogin:true,
          showLogin: true
      })
      setTimeout(()=>{
          that.setData({
              mask: true
          })
      },100)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    that.init()
    if(that.data.chooseContactBack){
      that.setData({
        appointTap: true
      })
    } else {
      that.setData({
        appointTap: false
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
            loginData: {
                show_modal: false,
                height:wx.getSystemInfoSync().windowHeight
            },
        })
        _login.getToken().then(res=>{
            let state = wx.getStorageSync('loginStatus');
            let user = wx.getStorageSync('loginUser');
            if(state){
                that.setData({
                    isLogin:true,
                    collectDespoit:user
                })
            }else{
                that.setData({
                    isLogin:false
                })
            }
        })
        that.init();
    }
  },
  init() {
    let that = this
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    let village_activity_id = this.data.collectId;
    if (currPage.data.chooseContactBack.length == 0) {
      _api.diffState((res) => {
        if(res.data.userInfo){
          that.setData({
              isLogin:true
          })
        }else{
            that.setData({
                isLogin:false
            })
        }
        if (res.data.user_id != null) {
          _api.reqDcontact((res) => {
            console.log(res)
            that.setData({
              chooseMessage: res,
              pageStatus: true,
              chooseContactBack: ''
            });
          })
        }
      })
    } else {
      console.log(currPage.data.chooseContactBack)
      that.setData({
        chooseContactBack: currPage.data.chooseContactBack,
        chooseMessage: '',
        pageStatus: false
      });
      console.log(that.data.chooseContactBack, 222)
    }
    if (this.data.options.judgeCollect == 1) {
      this.shareCollcet();
      console.log(this.data.options.id);
      if (this.data.options.id != "undefined") {
        app.updateref_user(this.data.options.id);
      }
      this.setData({
        returnIndex: true
      })
    } else {
      this.reqIdentity(this.data.collectId);
      this.reqNumber(this.data.collectId);
      this.reqComment(this.data.collectId);
      this.getCollectDetail(this.data.collectId);
    }
  },

  wxLogin(e){
      let that = this;
      let data = e.detail.encryptedData;
      let iv = e.detail.iv;
      if(e.detail.errMsg === "getPhoneNumber:ok") {
          _api.wxLogin({data:data,iv:iv},res=>{
            console.log('res',res);
              if(res.resultCode===1000){
                  wx.setStorageSync("loginStatus", res.data.loginstatus);
                  wx.setStorageSync("loginUser", res.data.loginUser);
                  that.setData({
                      collectDespoit:res.data.loginUser
                  })
                  that.setData({
                      isLogin:true,
                      showLogin: true
                  })
                  setTimeout(()=>{
                      that.setData({
                          mask: true
                      })
                  },100)
              }else if(res.resultCode === 1005){
                  that.setData({
                      show:true
                  })
                  setTimeout(()=>{
                      that.setData({
                          masks:true
                      })
                  },10)
              }
          })
      }else{
          this.setData({
              show:true
          })
          setTimeout(()=>{
              this.setData({
                  masks:true
              })
          },10)
      }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    // console.log(res);
    // if (res.from === 'button') {
    //   setTimeout(obj => {
    //     wx.reLaunch({
    //       url: '/pages/group/group?village_id=' + this.data.options.villageId
    //     })
    //   }, 300)
    // }
    let obj = {
      title:this.data.nickName + '邀请你一起集采' + this.data.collectRecordDto.project_name,
      img: this.data.collectRecordDto.share_img,
      url:"pages/collect/collect/collect?collectId=" + this.data.collectId + '&villageId=' + this.data.options.villageId + '&judgeCollect=1' + '&id=' + this.data.reqId
    }
    return _base.shareData(obj);
  }
})
