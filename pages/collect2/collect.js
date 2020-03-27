import { Base } from '../../utils/base.js';
import { Api } from '../../utils/api.js';
import { login } from '../../utils/login.js';
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
    isAuth:false,
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
    id:'',
    shareHome:false,
    status:'',//用户状态
    user:'',
    imgList:[]
  },

  onLoad: function(options) {
    console.log('111',options);
    let scene = decodeURIComponent(options.scene);
  
    let h = wx.getSystemInfoSync().windowHeight;
      this.setData({
          id:options.id,
          options:options
      })
    if (scene !='undefined') {
      this.setData({
        id: scene 
      })
    }

    let that = this;
    // _login.wxLogin2();
    let obj = {};
    if(scene !== 'undefined'){
        obj.collectId = scene;
        obj.villageId = 22;
        options = obj;
        this.setData({
            shareHome:true
        })
    }
    if(options.type){
        this.setData({
            shareHome:true
        })
    }
    
    let id = obj.collectId || options.id;

    let c = {
        id:id,
        url:"pages/collect2/collect?id=" + id
    }
    _api.toSubscription(c,res=>{
        console.log('collect',res);

      if (res.data.status<=0){
        wx.showModal({
          title: '提示',
          content: '二维码已失效',
          showCancel: false,
          confirmText:  "确定",
          confirmColor: "#E94816",
          success: function (res) {
            wx.switchTab({
              url: '../agent/agent',
            })
          }
        })
        return
      }
        let data = res.data;
        var split = ''
        if(data.evaluateInfo){
          data.evaluateInfo.updateAt = data.evaluateInfo.updateAt.split(' ')[0];
          if (data.evaluateInfo.imgUrl){
            split = data.evaluateInfo.imgUrl.split(';')
          }
        }
        wx.setNavigationBarTitle({ title: data.project_name});
         that.setData({
            collectRecordDto:data,
            isOver:res.dataReserve1,
            height:h,
            imgList: split
        })
    })
  },
//订金 ！ 弹框
  messageMole:function(){
    _base.showAlert('有效期内集采价只能降不能加，超过订金有效期，商家有权不转单或者涨价转单。例外情况：如果遇到品牌厂家总部实施全国统一涨价，保价自动失效。')
  },
    //查看全部
    showAll(){
      let data = this.data.collectRecordDto;
      let type = data.evaluateInfo.evaluteType;
      let id = '';
      if(type==1){
            id = data.id;
      }else{
            id = data.evaluateInfo.id
      }
      wx.navigateTo({
        url: '../showEvalute/show?id='+id+'&type='+type
      })
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

  showLoginData(res) {
    let that = this;
    that.setData({
      collectDespoit: res.detail.user,
      isLogin: true,
      showLogin: true
    })
  },
    //隐藏登录
    hideRowLogin(e){
      if (e.detail.suc){
        this.setData({
          isLogin: e.detail.suc,
          masks:false
        })
        let collectId = this.data.id;
        wx.redirectTo({
          url: '/pages/my/my-deposit/deposit-add2/deposit-add?id=' + collectId + '&type=1'
        })
      }
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

    showDeposit(){
      wx.navigateTo({
        url: '../my/my-deposit/deposit-list/deposit-list'
      })
    },

    toAuth(){
      let user = this.data.user;
      let txt = '';
      let url = '';
        if(user){
            if(user.userAut){
                if(user.userAut.status == 0){
                    txt = '认证审核中'
                    url = '/pages/my/my-member/member-estate-auth/auth-form-res/auth-form-res'
                }
            }else{
                txt = '请先认证';
                url = "/pages/my/my-member/member-estate-auth/estate-auth-form/estate-auth-form?village_name=体验小区&village_id=22"
            }
        }else{
            txt = '请先认证';
            url ="/pages/my/my-member/member-estate-auth/estate-auth-form/estate-auth-form?village_name=体验小区&village_id=22"
        }
        if(txt){
            wx.navigateTo({
                url: url
            })
        }
    },

    //交定金
    wxLoginGold(e){
        let that = this;

        let data = e.detail.encryptedData;
        let iv = e.detail.iv;
   
        let collectId = this.data.id;
        if(e.detail.errMsg === "getPhoneNumber:ok") {
            _api.wxLogin({data:data,iv:iv},res=>{
                console.log('res',res);
                wx.setStorageSync("loginStatus", res.data.loginstatus);
                wx.setStorageSync("loginUser", res.data.loginUser);
                if(res.resultCode===1000){
                  wx.redirectTo({
                    url: '/pages/my/my-deposit/deposit-add2/deposit-add?id=' + collectId + '&type=1'
                  })
                    that.setData({
                      collectDespoit:res.data.loginUser,
                      isLogin: true
                    })
                    // _api.progressDetail(collectId, (res) => {  
                    //     wx.hideLoading();
                    //     if(res.data.so_info){
                    //        that.changeData(res)
                    //     }else{
                    //         wx.redirectTo({
                    //             url: '/pages/my/my-deposit/deposit-add/deposit-add?id=' + collectId
                    //         })
                    //     }
                    // });
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
    //输入手机号码登陆后更新数据 
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
  alreadyGroup: function() {
    wx.navigateTo({
      url: '/pages/my/my-group/my-group-list/my-group-list'
    })
  },
    //咨询团长
    callCapital(){
        let h = wx.getSystemInfoSync().windowHeight;
        this.selectComponent('#my-commander').getInfo()
        this.setData({
            height: h,
            commanderHiden: true,
            showTab:false
        })

    },
  //交定金
  depositGold: function(e) {
    var collectId = this.data.id;
    console.log('collectId',collectId);
    wx.redirectTo({
      url: '/pages/my/my-deposit/deposit-add2/deposit-add?id=' + collectId + '&type=1 &data=' + this.data.collectRecordDto.valid_days+''
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
          user:res.data.userInfo
        })
      } else {
        var nickName = wx.getStorageSync('nickName');
        this.setData({
          nickName: nickName
        })
      }
      if(res.data.userInfo){
          if(res.data.userInfo.userAut){
              if(res.data.userInfo.userAut.status == 1){
                  this.setData({
                      isAuth:true
                  })
              }
              this.setData({
                  status:res.data.userInfo.userAut.status
              })
          }
      }
    })
  },

  reqComment(collectId) {
    // 获取评论数据接口
    _api.reqComment(collectId, (res) => {
      console.log('res',res);
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
      this.reqComment(this.data.collectId);
    }
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    let obj = {
      title:this.data.nickName + '邀请你一起集采' + this.data.collectRecordDto.project_name,
      img: this.data.collectRecordDto.share_img,
      url:"pages/collect2/collect?id=" + this.data.id+'&type=1'
    }
    return _base.shareData(obj);
  }
})
