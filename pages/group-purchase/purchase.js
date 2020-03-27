// pages/group-purchase/purchase.js
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
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      infoList:[],
      tip:'选择自己感兴趣的项目，正确提交报名信息',
      rNumber:0,//报名人数
      imgList:[],//头像
      rideList:[],//乘车地点
      carList:[],//乘车点经纬度数据
      base_id:6,
      village_id:22,
      banner:'',
      share_img:"", //分享img
      copy_write:String, //分享Title
      products:[],//产品列表
      isLogin:Boolean,
      addressList:[],
      showLogin:false,
      checkAll:false,
      mask:false,
      show:false,
      masks:false,
      collectDespoit:{},
      collectId:0,
      options:{},
      info:{},//报名信息
      allEnroll:false,//是否全部报名
      imgUrls:[],//商标
      remark:[],//评论
      senceList:[],//场景
      height:'',//高度
      shareHome:false,//分享
      scanCode:false,
      timestamp:0,
      allOver:false,
      time: '',//时间
/**子组件myCommander**/
    height: '', //设备高度
    commanderHiden: false,
    showTab: Boolean,
    userId:'',
    scopeUserInfo:false,//是否授权过
    userNamescof:'',//授权昵称
    newuserNamescofs:{},
    onHideeroll:false,

  },

  changeTip(e){
    let id = e.currentTarget.id;
    let tip = '';
      console.log(typeof id);
    switch (id) {
        case '0':
          tip = '选择自己感兴趣的项目，正确提交报名信息';
          break;
        case '1':
          tip = '团长邀请进入集采群，任何问题可群内咨询';
          break;
        case '2':
          tip = '集采当天，指定乘车地点签到后前往店面了解产品，如有购买意向可支付订金';
          break;
        case '3':
          tip = '确认省钱，正式下单付余款';
          break;
    }
    this.setData({
        tip:tip
    })
  },
  //查看地址
  openLocation(){
      let data = this.data.carList;
      wx.navigateTo({
        url: '../map/map?data='+JSON.stringify(data)
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  //被邀请人进来，调用此方法；

    if (options.userId) {
      // _base.updateInvite(options.userId)
      this.setData({
        userId: options.userId
      })
    }

      let h = wx.getSystemInfoSync().windowHeight
      let scene = decodeURIComponent(options.scene);
      if(scene !== 'undefined'){
          let temp = scene.split('&');
          options.base_id = temp[0].split('=')[1];
          options.villageId = temp[1].split('=')[1];
          this.setData({
              scanCode:true
          })
      }
      this.setData({
          base_id:options.base_id,
          village_id:options.villageId,
          options:options,
          height:h
      })

      if(options.shareType == 1 || scene !== 'undefined'){
          this.setData({
              shareHome:true
          })
      }
  },

  returnHome(){
      wx.reLaunch({
          url: '/pages/group/group?village_id=22&shareAfter=1'
      })
  },

  //获取图片列表
 getProductsImg(){
      let that = this;
      return new Promise(resolve => {
          _api.collectPlist(that.data.base_id,that.data.village_id,res=>{
              console.log('产品图片',res);
              let infoList = res.data.activityInfoList;
              let status = '';
              let temp = [];
              let timestamp = Date.parse(new Date());
              let index = 0
              for(let o of infoList){
                  for(let i of o.projects){
                      i.isEnroll = false;
                      if(timestamp>new Date(i.enroll_end_at.replace(/-/g,'/'))){
                          i.isOver = true;
                          index++;
                      }else{
                          i.isOver = false;
                      }
                  }
                  temp = temp.concat(o.projects);
              }
              let over = false;
              if(index === temp.length) over = true;
              console.log('baseEnrollStatus',res.data.baseEnrollStatus);
              if(res.data.baseEnrollStatus === '2'){
                  status = true;
                  console.log('te',res);
              }else{
                  status = false;
                  console.log('le',res);
              }
              that.setData({
                  products:temp,
                  allEnroll:status,
                  allOver:over
              })
              resolve('success')
          })
      })
 },

  //获取乘车点
  getLocationOfCar(){
      let that = this;
      _api.joinImg(this.data.base_id,res=>{
          console.log('乘车点',res);
          let data = res.data.baseRidingList;
          let img = res.data.img_url;
          let share_img = res.data.share_img;
          let copy_write = res.data.copy_write;
          let ride = [];
          let carData = [];
          let timeOver = '';
          let timestamp = Date.parse(new Date());
          if(timestamp > new Date(res.data.endAt.replace(/-/g,'/'))){
            timeOver = true;
          }else{
            timeOver = false;
          }
          for(let o of data){
              let robj = {
                  id: o.ridingId,
                  name: o.name,
                  addr:o.address
              }
              let cobj = {
                  latitude:o.latitude,
                  longitude:o.longitude,
                  name:o.address,
                  id:o.ridingId,
                  iconPath:'../../images/didian01.png'
              }
              ride.push(robj);
              carData.push(cobj);
          }
          that.setData({
              rideList:ride,
              carList:carData,
              banner:img,
              share_img: share_img,
              copy_write: copy_write,
              imgUrls:res.data.brandsImgList,
              remark:res.data.evaluateImgList,
              senceList:res.data.sceneImgList,
              time:res.data.endAt,
              timeOver:timeOver
          })
      })
  },
    //手机号密码 登录 
    showLoginData(res){
        console.log('loginres',res);
        let user = res.detail.user;
        let that = this;
        this.getProductsImg().then(res=>{
            let state = that.data.allEnroll;
            that.setData({
                collectDespoit: user
            })
            if(user.collect){
                that.setData({
                    collectId:user.collect
                })
            }
            if(!state){
                that.setData({
                    isLogin:true,
                    showLogin: true
                })
                setTimeout(()=>{
                    that.setData({
                        mask: true
                    })
                },100)
            }else{
                that.setData({
                    isLogin:true
                })
            }
        })
    },

  //获取头像
 getAvar(){
      let that = this;
      _api.deleteAgain(this.data.base_id,this.data.village_id,res=> {
          console.log('头像',res);
          let data = res.data;
          that.setData({
              infoList:data
          })
          let temp = [];
          for(let o of data){
              temp.push(o.icon);
          }
          that.setData({
              imgList:temp
          })
      })
 },
 //报名人数
 getRegisterNum(){
      let that = this;
      _api.showCollect(this.data.base_id,res=>{
          console.log('报名',res);
          that.setData({
              rNumber:res.data
          })
      })
 },
//微信授权登录
wxLogin(e){
    let that = this;
    let data = e.detail.encryptedData;
    let iv = e.detail.iv;
    let id = _base.getDataSet(e,'id');
    let type = _base.getDataSet(e,'type');
    if(e.detail.errMsg === "getPhoneNumber:ok") {
      console.log(that.data.userId,'that.data.userId')

        _api.wxLogin({data:data,iv:iv},res=>{
            console.log('res',res);
            if(res.resultCode===1000){
                wx.setStorageSync("loginStatus", res.data.loginstatus);
                wx.setStorageSync("loginUser", res.data.loginUser);


                that.getProductsImg().then(res2=>{
                    let state = that.data.allEnroll;
                    if(type){
                      that.setData({
                          collectId:id
                      })
                    }
                    if(!state){
                        that.setData({
                            collectDespoit:res.data.loginUser,
                            showLogin: true,
                            isLogin:true
                        })
                        setTimeout(()=>{
                            that.setData({
                                mask: true
                            })
                        },100)
                    }else{
                        that.setData({
                            isLogin:true
                        })
                    }
                });
            }else if(res.resultCode === 1005){
                this.setData({
                    show:true
                })
                setTimeout(()=>{
                    this.setData({
                        masks:true
                    })
                },10)
            }
        })
    }else{
        if(type){
            that.setData({
                collectId:id
            })
        }
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
//复制
    copyTBL:function(e){
      wx.setClipboardData({
          data: 'duorang1',
          success: function(res) {
                  wx.showToast({
                      title: '复制成功',
                      duration:1000
                  })
          }
      });
  },

 //立即预约
    bespeak(e){
        let id = _base.getDataSet(e,'id');
        let index = _base.getDataSet(e,'index');
        let info = {index:index};
        this.setData({
            checkAll:false,
            collectId:id,
            info:info,
            showLogin:true
        })
        setTimeout(()=>{
            this.setData({
                mask:true
            })
        },10)
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

    //一键报名
    register(){
      var userName = wx.getStorageSync('loginUser');
      if (!userName.user_name){
        wx.navigateTo({
          url: '../newLogin/index',
        })
        return
      }

      this.setData({
        checkAll: true,
        showLogin: true,
        collectId: 0
      })

      wx.vibrateShort()
      setTimeout(()=>{
          this.setData({
              mask:true
          })
      },10)
    },
    //用户信息
    getUserInfo(){
      let that = this;
        let state = wx.getStorageSync('loginStatus');
        let scopeUserInfo = wx.getStorageSync('scopeUserInfo');
        let user = wx.getStorageSync('loginUser');

        if (state){
            let userNamescof = wx.getStorageSync('nickName');
            that.setData({
              isLogin: true,
              userNamescof: userNamescof,
              scopeUserInfo: scopeUserInfo,
            })

          }else{
            that.setData({
              isLogin: false,
              scopeUserInfo: scopeUserInfo
            })
        }
        
        this.setData({
          collectDespoit: user,
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
    //隐藏登录
    hideRowLogin(e){
        this.setData({
            masks:false
        })
        setTimeout(()=>{
            this.setData({
                show:false
            })
        },300)
    },
  onShow: function () {
    this.getAvar();
    this.getRegisterNum();
    this.getLocationOfCar();
    this.getProductsImg();
    this.getUserInfo(); 

//选择报名信息返回值
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    let json = currPage.data.newuserNamescofs;

    if (Object.keys(json).length != 0) {
      this.setData({
        newuserNamescofs: json
      })
    }else{
      //有默认联系人就 显示默认联系人；
      _api.diffState(res => {
        let userInfo = res.data.userInfo;
        if (userInfo){
          var linkDTO = userInfo.userLinkDTO;
          var newuserNamescofs = {};

          for (var i of linkDTO) {
            if (i.is_default === 1) {
              newuserNamescofs.link_name = i.link_name;
              newuserNamescofs.link_mobile = i.link_mobile;
              newuserNamescofs.userId = i.id
            }
          }

          this.setData({
            newuserNamescofs: newuserNamescofs
          })
        }

      })
    }
    


  },

  onShareAppMessage: function () {
    var loginUserId = wx.getStorageSync('loginUser');
    console.log(`%c 阿文提醒您：大巴团分享者ID为：${loginUserId.id}`, `color:#f00;font-weight:bold;`)
      let obj = {
        title: this.data.copy_write,
        url: "pages/group-purchase/purchase?base_id=" + this.data.base_id + '&villageId=' + this.data.village_id + '&shareType=1' + '&userId=' + loginUserId.id,
        img: this.data.share_img
      }
      return _base.shareData(obj);  
      }
})
