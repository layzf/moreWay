
import { Base } from '../../utils/base.js';
import { Api } from '../../utils/api.js';
import { login } from '../../utils/login.js';
var _base = new Base();
var _login = new login();
var _api = new Api();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:true,
    canIUseGetUserProfile:false,
    userInfor:{
      loginStatus:'', //true：授权过手机号 false：没有授权过手机号
      userName:'' ,//是否授权过用户名
      invterUserId:'',//邀请人的id
      loadingBtns:false,//按钮加载中icon
    },
    //封窗搜索小区，有我的小区
    villageInfo:{},

    //封窗搜索小区，没有我的小区
    seachVillage:{

    },
    //封窗第三步 预约量尺
    ThreeDetailObjs:{
      
    },
    //首页大巴团数据
    IndexObjs:{

    },
    //自助报价的对象
    ziObj:{
      // id: 项目id,
      // valid_days: 有效期,
      // type: 状态
      //toUrl:门柜是否点击查看价格进入；
    },

    //大巴团点击项目立即报名获取项目ID
    changeProjectObj:{

    },
    prevPage:{},//页面栈信息
  },
//勾选
  checkboxChange: function (e) {
    e.detail.value.length ? this.setData({ checked: false }) : this.setData({ checked: true })
  },
  //用户协议
  userBook: function (e) {
    var tag = e.currentTarget.dataset.tag;
    wx.navigateTo({
      url: `/pages/userBook/index?tag=${tag}`,
    })
  },
  onLoad: function (options) {
    console.log(options,"options")
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
//是否支持新授权机制
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
//邀请人ID
    if (options.pid){
      this.setData({
        invterUserId: options.pid
      })
    }
 //首页大巴团数据：
    if (options.IndexObjs){
      this.setData({
        IndexObjs: JSON.parse(options.IndexObjs)
      })
    }
//从大巴团 点击的 项目立即报名
    if (options.changeProjectType){
      this.setData({
        changeProjectObj:options
      })
    }
    //封窗详情第三步 预约量尺：
    if (options.ThreeDetailObjs){
      this.setData({
        ThreeDetailObjs: JSON.parse(options.ThreeDetailObjs)
      })
    }
    //搜索小区，没有我的小区点击进入
    if (options.seachVillage){
      this.setData({
        seachVillage: JSON.parse(options.seachVillage)
      })
    }
//门柜自助报价
    if (options.toUrl){ 
      var ziObj = {
        id: options.ziId,
        valid_days: options.valid_days,
        type: options.type,
        anujiaType: options.anujiaType,
        toUrl: options.toUrl
      }
      this.setData({
        ziObj: ziObj,
      })
    }


//搜索小区，有我的小区点击进入
    if (options.villageId){
      this.setData({ 
        villageInfo: { villageId: options.villageId, villageName: options.villageName}
      })
    }

    this.setData({
      prevPage: prevPage,
    })
    console.log(this.data.seachVillage,"invterUserId")
  },
  //判断是否授权手机号 和昵称头像
  info(){
    let loginStatus = wx.getStorageSync('loginStatus'); //登录状态
    let userInfor = wx.getStorageSync('loginUser'); //用户信息状态

    let info = {
      loginStatus: loginStatus,
      userName: userInfor && userInfor.user_name
    }
    this.setData({
      userInfor: info
    })
  },
//授权昵称
  getUser: function (e) {
    this.setData({
      loadingBtns:true
    })
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (e) => {
      var {encryptedData,iv} = e
      var {nickName:name,avatarUrl} = e.userInfo;
      wx.setStorageSync('avatarUrl', avatarUrl);
      wx.setStorageSync('nickName', name);
      wx.setStorageSync('encrypted', {encryptedData,iv});
      _login.getToken(name, avatarUrl).then(res => {
        let usertStorage = wx.getStorageSync('loginUser');
        let prevPage = this.data.prevPage;
        let router = prevPage.route;
        switch (router){
//未登录，从首页进入大巴团：
          case 'pages/group/group' :
            let { type, base_id, villageId, cPreview } = this.data.IndexObjs;
            setTimeout(res => {
              wx.redirectTo({
                url: '../group-purchase/purchase?base_id=' + base_id + '&villageId=' + villageId + '&cPreview=' + cPreview
              })
            }, 300);
          break;
//昵称未授权，从大巴团活动页面进入：
          case 'pages/group-purchase/purchase' :
            prevPage.setData({
              showLogin: true,
            });
            setTimeout(() => {
              prevPage.setData({
                mask: true
              })
            }, 10);
//返回大巴团页面，勾选当前项目;        
            var changeProjectObj = this.data.changeProjectObj;
            if (changeProjectObj.changeProjectType) {
              prevPage.setData({
                collectId: changeProjectObj.id,
              });
            }
            this.navigateBack()
          break;
//验房详情页面 返回手机号，显示预约弹框
          case 'pages/y-indexDetail/y-indexDetail' :
            prevPage.setData({
              collectDespoit: usertStorage,
              'orderModel.disTag': true,
              'orderModel.classa': true,
            });
            this.navigateBack()
          break;
 //自主报价
          case 'pages/door-index/index':
            var { id, valid_days, type, toUrl} = this.data.ziObj;
            if (toUrl=='none'){
              this.navigateBack() //查看价格 返回自助页面
            } 
            else if (toUrl == 'swcount') { //预约量尺
              var { typeSetp, categoryId, shareName, shareUrl, changePId } = this.data.ThreeDetailObjs;
              wx.redirectTo({
                url: '../sw-count/index?typeSetp=' + typeSetp + '&categoryId=' + categoryId + '&shareName=' + shareName + '&shareUrl=' + shareUrl + '&id=' + changePId + '&isShowCoun=1' ,
              })
            }
             else {   //交订金
              wx.redirectTo({
                url: '/pages/my/my-deposit/deposit-add2/deposit-add?id=' + id + '&type=1 &data=' + valid_days
              })
            }
            break;
//封窗第三步 预约量尺
          case 'pages/sw-three-detail/index':
            var { typeSetp, categoryId, shareName, shareUrl, changePId } = this.data.ThreeDetailObjs;
            wx.redirectTo({
              url: '../sw-count/index?typeSetp=' + typeSetp + '&categoryId=' + categoryId + '&shareName=' + shareName + '&shareUrl=' + shareUrl + '&id=' + changePId +'&isShowCoun=0' ,
            })
            break;
//封窗没有我的小区
          case 'pages/sw-seachVillage/sw-seachVillage':
            var objs = {}
            if (Object.keys(this.data.seachVillage).length){
              objs = this.data.seachVillage
            }
            var { categoryId, shareName, shareUrl } = objs;
//如果没有我的小区，跳到申请页面；
            if (this.data.villageInfo.hasOwnProperty('villageId')){
              wx.redirectTo({
                url: `../sw-layout/sw-layout?id=${this.data.villageInfo.villageId}&categoryId=${categoryId}&shareName=${shareName}&shareUrl=${shareUrl}`,
              })
            }else{
              wx.redirectTo({
                url: `../sw-inspectionGroup/sw-inspectionGroup?categoryId=${categoryId}&shareName=${shareName}&shareUrl=${shareUrl}&changeNotMyVill=1`,
              })
            }
            break;
//其他的直接返回页面
          default:
            this.navigateBack()
        }
      }) 
      },
      fail:()=>{
        this.setData({
          loadingBtns: false
        })
      }
    })
      
  },
  navigateBack(){
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      })
      this.setData({
        loadingBtns: false
      })
    }, 1000)
  },
 //授权手机号
  getPhone(e) {
    let data = e.detail.encryptedData;
    let iv = e.detail.iv;
    let that = this;
    if (e.detail.errMsg === "getPhoneNumber:ok") {
      _api.wxLogin({ data: data, iv: iv }, res => {
        console.log(res, "手机号哦登录")
        if (res.resultCode === 1000) {
          wx.setStorageSync("loginStatus", res.data.loginstatus);
          wx.setStorageSync("loginUser", res.data.loginUser);
//刷新一遍用户缓存数据
          this.info()

          var prevPage = this.data.prevPage;
//验房详情页面 返回手机号
          if (prevPage.route === 'pages/y-indexDetail/y-indexDetail') {

              prevPage.setData({
                collectDespoit: res.data.loginUser.mobile,
                'orderModel.disTag': true,
                'orderModel.classa': true,
              });

          }
//邀请人ID 或者 金雕的二维码 邀请接口好像没用，团长在后台自行可以去匹配。暂时保留

          if (getApp().globalData.qrUserId || this.data.invterUserId) {
            console.log(`%c 阿文提醒您，手机号授权登录用户ID为：${this.data.invterUserId}`, `color:#f00;font-weight:bold;`)
            console.log(getApp().globalData.qrUserId, "this.globalData.qrUserId")

            _api.updateInvite(getApp().globalData.qrUserId || userId, res => {
              console.log(res, "刘博文")
            })
          }

        }else if(res.resultCode === 1001 ){
          //授权失败 重新条用buildSession
          _login.wxLogin2()
        }
      })
    }
  },

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.info()
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