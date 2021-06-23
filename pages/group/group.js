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
  data: {
    showImgs:false,
    tabHeight: '',//周末团高度
    tabTop:'',//周末团距离顶部距离
    lever: false,//滚动事件属性
    groupEstatePara: {},
    sliders: [],
    collects: [],
    easteName: [],
    groupData: {},
    isLogin:false,
    isAuth:false,
    //show_modal: false,
    judgeType: false,
    options: '',
    userInfo:null,
    judgeIndexes: false,
    judgeSure: false,
    collectPerdect: '',
    judgeJoin: false,
    loginStatus: '',
    showTip:null,
    show:false,
    mask:false,
    proList:[],
    proImgList:[],
    imgUrls:[1,2,3],
    userId:''//用户id
  },



  onLoad: function(options) {
    wx.request({
      url: 'https://zdx.qiaomukeji.com/zhangdaxian/award/getList',
      data:{pageSize: 3, pageNum: 1},
      type:'POST',
      success:(e)=>{
        console.log(e,"aaa")
      }
    })

    
    console.log("判断是否由分享进入小程序", options)
// 判断是否由分享进入小程序
    if (options.userId){
      this.setData({
        userId: options.userId
      })
    } 
    this.setData({
      options: options,
      height: wx.getSystemInfoSync().windowHeight
    })

    this.getSlider();

    this.getCollects();

  },

  touchstart:function(e){
    this.setData({
      lever:true
    })
  },
  touchend:function(e){
    this.setData({
      lever: false
    })
  },
//获取验房入口距离顶部高度
  fixdModelY:function(data){
    var that = this;
    var type = false;
    for (let i = 0; i < data.length;i++){
      if (data[i].img_url){
         type = true
      }
    }
    if(type){
      console.log('图片加载完毕')
      wx.createSelectorQuery().select('.seleact').boundingClientRect(function (rect) {
        console.log(rect, "aaaa")
        that.setData({
          tabTop: rect.top,
          tabHeight: rect.height,
          showImgs: true
        })
      }).exec()
    }
    
  },

  loginCode: function () {
      wx.navigateTo({
          url: '/pages/my/my-auth-code/my-auth-code',
      })
  },
  checkAuth(){
    _login.wxLogin2(this.data.userId,res=>{
      console.log(res,"res回调用户的ID")
      app.globalData.userId = res
    })

    let that = this;
        wx.getSetting({
            success(res) {
               if(res.authSetting['scope.userInfo']){
                   let state = wx.getStorageSync('loginStatus');
                   if(!state){
                     _login.getToken(that.data.userId);
                   }
               }
            }
        })
    },

  getSlider() {
    _api.getSlider((res) => {
      this.setData({
        sliders: res
      });
    });
  },
  goYindex(){
    wx.navigateTo({
      url: '../y-index/y-index',
    })
  },
  toPage(){
    console.log('gotopage');
    let isLogin = this.data.isLogin;
    let isAuth = this.data.isAuth;
    if(!isLogin){
        wx.navigateTo({
            url: '/pages/login/login',
        })
    }else if(!isAuth){
        wx.navigateTo({
            url: '/pages/my/my-member/member-estate-auth/estate-auth-form/estate-auth-form'
        })
    }
  },

  getCollects() {
    let id = wx.getStorageSync('village_id');
    if(!id){
      id = this.data.options.village_id || 22
    }
    _api.collectPredect(id, (res) => {
      let timestamp = Date.parse(new Date());
      let data = res.data;
      for(let o of data){
          if(timestamp>new Date(o.end_at.replace(/-/g,'/'))){
              o.isOver = true;
          }else{
              o.isOver = false;
          }
      }
      this.setData({
        collectPerdect: data
      })
      this.fixdModelY(data)
    })
  },
  //查看
  look(e){
    let index = e.currentTarget.id;
    wx.setStorageSync('index', index);
      wx.switchTab({
          url: '/pages/agent/agent'
      })
  },

  //选择项目
  chooseItem(e){
    let type = e.currentTarget.id;
    let index = e.currentTarget.dataset.index;
    let proImg = this.data.proImgList;
    let pro = this.data.proList;
    let project = '';
    let url = '';
    if(type === 'temp'){
        project = pro[index];
    }else{
        project = proImg[index];
    }
    if(project.project_type === 1){
        let d = {
            id:project.id,
            url:''
        }
        _api.toSubscription(d,res=>{
            let data = res.data;
            let temp = data.freightTemplate;
            let txt = '';
            if(temp){
                let favorable = temp.freightTemplateDetailList;
                if(temp.feeType>1){
                    for(let o of favorable){
                        if(temp.priceType === 1){
                            txt += `在${o.firstNumber}元以内,运费${o.firstAmount}元; `;
                        }else{
                            txt += `在${o.firstNumber}件以内,运费${o.firstAmount}元; `;
                        }
                    }
                }else{
                    txt = '该商品包邮'
                }
            }
            let cid = data.categoryId;
            wx.navigateTo({
                url: '../agentShop/shop?id='+project.id+'&cid='+cid+'&txt='+txt+'&auth='+data.authNeed+'&percent='+data.return_value+'&ptype='+data.return_type
            })
        })
    }else{
        if(project.status === 2){
            url = '../collect3/collect?id='+project.id;
        }else{
            url = '../collect2/collect?id='+project.id;
        }
    }
    wx.navigateTo({url:url})
  },

  lunboJudge:function(e){
    // 点击轮播图
    // let collectId = 38;
    console.log(e)
    if (e.currentTarget.dataset.url) {
      let url = e.currentTarget.dataset.url
      wx.navigateTo({
        url: url
      })
    }
    // setTimeout(res => {
      // wx.navigateTo({
      //   url: '../collect/collect/collect?collectId=' + collectId + '&villageId=' + this.data.options.village_id
      // })
    // }, 300)
  },
  getGroupData() {
    _api.getGroupData((res) => {
      var res = res.data;
      let groupData = {
        countUser: res.countUser,
        countActivity: res.countActivity,
        countProject: res.countProject,
        countSo: res.countSo,
        countEnroll: res.countEnroll,
      }
      this.setData({
        groupData: groupData
      });
    });
  },
  getGroupPageInfo(estateId) {
    _api.getGroupPageInfo(estateId, (res) => {

      var objs = res.data.datas;
      wx.setStorageSync("village_name", res.data.record.village_name);
      wx.setStorageSync("village_id", res.data.record.id);
      for (var i = 0; i < objs.length; i++) {
        var time2 = app.times(objs[i].beg_at);
        var time4 = app.times(objs[i].end_at);
        objs[i].beg_at = app.timestampToTime(time2);
        objs[i].end_at = app.timestampToTime(time4);
      }
      console.log(res.data, 22)
      this.setData({
        collects: res.data.datas,
        easteName: res.data.record
      });
    });
  },
  joinHelp: function() {
    if (this.data.loginStatus == true) {
      var that = this;
      _api.helpBecome(this.data.village_id, (res) => {

        _base.showToast("报名成功", "loading", 2000, function() {
          if (res.resultCode == 1000) {
            setTimeout(res => {
              wx.navigateTo({
                url: '../helpOpen/inviteFriend/inviteFriend?village_id=' + that.data.village_id,
              })
            }, 500)
          }
        })
      })
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  judgeIndex: function(village_id) {
    _api.dealDetail(village_id, (res) => {

      var needPeople = res.data.record.open_num - res.data.size;
      var percent = (res.data.size / res.data.record.open_num) * 100;
      console.log(percent);
      if (res.data.isapply == true) {
        this.setData({
          judgeJoin: true
        })
      } else {
        this.setData({
          judgeJoin: false
        })
      }
      this.setData({
        village_id: village_id,
        detailList: res.data.record,
        dataList: res.data,
        needPeople: needPeople,
        percent: percent,
        judgeIndexes: true
      })
      wx.setNavigationBarTitle({
        title: "助力开通小区",
      });
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#5DAFF7'
      })
    })
  },
  // 限时集采
  collectPreview: function(e) {
    let base_id = _base.getDataSet(e, 'base_id');
    let type = _base.getDataSet(e, 'type');
    let state = wx.getStorageSync('loginStatus');

    let villageId;
    if (this.data.loginStatus == true) {
      if (this.data.villageInfo != null) {
        villageId = this.data.villageInfo.id
      } else {
        villageId = this.data.options.village_id ||22
      }
    } else {
      villageId = this.data.options.village_id || 22
    }

   //没有授权去授权
    if (!state) {
      var objs = {
        base_id: base_id,
        villageId: villageId,
      }
      wx.navigateTo({
        url: '../newLogin/index?IndexObjs=' + JSON.stringify(objs),
      })
      return
    }

    setTimeout(res => {
      wx.navigateTo({
        url: '../group-purchase/purchase?base_id=' + base_id + '&villageId=' + villageId
      })
    }, 300)
  },
  greed(){
    wx.setStorageSync('setSyInfoQuoteId',2)
    wx.switchTab({
      url: '/pages/agent/agent',
    })
  },
  // 判断是否登录跳转到集采详情
  judgeCollect: function(e) {
    let collectId = _base.getDataSet(e, 'id');
    let enrollNum = _base.getDataSet(e, 'num')
    let villageId;
    if (this.data.judgeConfid.user_id != null) {
      if (this.data.villageInfo != null) {
        villageId = this.data.villageInfo.id
      } else {
        villageId = this.data.options.village_id
      }
    } else {
      villageId = this.data.options.village_id
    }
    setTimeout(ress => {
      console.log(villageId);
      wx.navigateTo({
        url: '../collect/collect/collect?collectId=' + collectId + '&villageId=' + villageId + '&enrollNum=' + enrollNum
      })
    }, 300)
  },
  //调起用户授权

  //展示长期团
  getBrandData(){
    let data = {
        page:1,
        pagesize:6,
        timeType:1,
        indexFlag:1
    }
      _api.progressList(data,res=>{
        console.log('brand',res);
        this.setData({
            proImgList: res.data
        })
      })
  },

  //临时团
  getTempData(){
      let data = {
          page:1,
          pagesize:6,
          timeType:2
      }
      _api.progressList(data,res=>{
          console.log('brand',res);
          let timestamp = Date.parse(new Date());
          let data = res.data;
          for(let o of data){
              if(o.end_at){
                  if(timestamp>new Date(o.end_at.replace(/-/g,'/'))){
                      o.isOver = true;
                  }else{
                      o.isOver = false;
                  }
              }else{
                  o.isOver = false;
              }
          }
          this.setData({
              proList: data
          })
      })
  },

  showIndetity: function() {
    let that = this;
    _api.diffState((res) => {
      console.log('showes',res);

      var b = (JSON.stringify(res.data) == "{}");

      var villageId;

      if (!b && res.data.user_id != null) {
        var obj = res.data.userInfo;
        if (obj.villageInfo != null) {
          if (obj.spreadIdentity == 1) {
           // this.getGroupPageInfo(obj.villageInfo.id);
          } else {
            //this.getGroupPageInfo(obj.villageInfo.id);
          }
          this.setData({
            villageId: obj.villageInfo.id
          })
        } else {
          if (this.data.options.helpIndex == 1) {
            var village_id = this.data.options.village_id;
            that.judgeIndex(village_id);
            this.setData({
              judgeSure: true,
            })
          } else {
            //this.getGroupPageInfo(this.data.options.village_id);
          }
          this.setData({
            villageId: this.data.options.village_id || 22
          })
        }
        this.setData({
          collectIdentity: res.data.userInfo,
          villageInfo: res.data.userInfo.villageInfo
        })
      } else {
        console.log(this.data.options.village_id);
        if (this.data.options.helpIndex == 1) {
          var village_id = this.data.options.village_id;
          this.judgeIndex(village_id);
          this.setData({
            judgeSure: true,
          })
        } else {
          //this.getGroupPageInfo(this.data.options.village_id);
        }
        this.setData({
          villageId: this.data.options.village_id || 22
        })
      }
      if(!b){
        this.setData({
          judgeConfid: res.data,
          userInfo: res.data.userInfo
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    
    that.init();
    this.setData({
      appointTap: false
    })

    

  },

  init() {
    let loginStatus = wx.getStorageSync('loginStatus');
    console.log('loginstate',loginStatus);
    var that = this;
    let groupEstatePara = app.groupEstatePara;
    var historyData = wx.getStorageSync("historyData");
    var judgeStart;
    this.setData({
      groupEstatePara: app.groupEstatePara,
      loginStatus: loginStatus
    });
    wx.setNavigationBarTitle({
      title: "多让"
    });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFFFFF'
    })
   this.setGroupHistory(groupEstatePara);
    if (this.data.options.shareType == 1) {
      that.showIndetity();
    } else {
      that.showIndetity();
    }
    that.getBrandData();
    that.getTempData();
  },

  setGroupHistory: function(data) {
    let historyData = wx.getStorageSync('historyData') || [];
    historyData.push(data);
    var unique = {};
    historyData.forEach(function(gpa) {
      unique[JSON.stringify(gpa)] = gpa
    });
    historyData = Object.keys(unique).map(function(u) {
      return JSON.parse(u)
    });
    if (historyData.length > 4) {
      historyData.splice(10, 1);
    }
    wx.setStorageSync('historyData', historyData);
  },

  tip:function(e){
    console.log('e0',e);
    let id = e.currentTarget.id;
    if(id === 'close'){
      this.setData({showTip:false})
    }else{
      this.setData({showTip:false});
      wx.switchTab({
          url:'../agent/agent'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var loginUserId = wx.getStorageSync('loginUser');
    
    let data = this.data.collectIdentity?this.data.collectIdentity:{id:''}
    let obj = {
      title: '多让业主集采，比普通团购再省10%-30%',
      img: '../../images/share.jpg',
      url: "pages/group/group?village_id=" + this.data.villageId + '&shareType=1&id=' + data.id + '&userId=' + loginUserId.id
    }
    console.log('分享',obj);
    return _base.shareData(obj);
  },
  move:function(){
    return false;
  }
})
