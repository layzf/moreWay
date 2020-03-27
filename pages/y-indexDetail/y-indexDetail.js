// pages/y-indexDetail/y-indexDetail.js
import { Api } from "../../utils/api";
import { Base } from "../../utils/base";
import { login } from '../../utils/login.js';

let _base = new Base();
let _api = new Api();
let _login = new login();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newuserNamescofs:{},
    startTime: '',//预约截止时间
    activeType: '',//活动状态（url 判断）
//立即预约弹框参数
    orderModel:{
      disTag: false,
      classa: true,
    },
    y_day:'',//截止时间
    id:'',//验房团id
    res:[],//详情数组
    
    price:'',//项目订金
    collectDespoit:{},//授权后的本地信息

    /**联系团长**/
    height: '', //设备高度
    commanderHiden: false,
    showTab: Boolean,
    load:false,
    groupList: [],//详情报名列表
    sortTemp:[],//报名倒叙

    orderInformation: {  },//验房团 团长信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, "options")
    
    let user = wx.getStorageSync('loginUser');
  
    let h = wx.getSystemInfoSync().windowHeight;


    this.setData({
      activeType:options.status,
      collectDespoit:user,
      height: h
    });
    
    if (options.project_id){
      this.setData({
        project_id: options.project_id,
        id: options.id
      })
    }



  },

  //咨询团长
  callCapital() {
    console.log("Asd")
    let h = wx.getSystemInfoSync().windowHeight;
    this.setData({
      height: h,
      commanderHiden: true,
      showTab: false
    })
  },
//详情
  groupDetail: function (status){
    _api.groupDetail(status, res => {
     
      // start_check_time

      var startTime =''

      if (res.groupDetail.start_check_time){
         startTime = res.groupDetail.start_check_time.substr(0, 10);//验房开始时间
      }
     

      let timestamp = Date.parse(new Date());

      var clock = ''

      var date = new Date(res.groupDetail.end_enroll_time.replace(/-/g, "/")); date = date.getTime();
  
      var endtimestamp =   date - timestamp;
 
      var y_day = Math.floor(endtimestamp / 86400000);
      //小区团长信息
      var obj = {
        name: res.groupDetail.group_link_name,
        tell: res.groupDetail.group_link_mobile,
        group_link_icon: res.groupDetail.group_link_icon,
        group_link_wx: res.groupDetail.group_link_wx,
        applied_sum: res.groupDetail.applied_sum,
      }
      this.setData({
        orderInformation: obj,
        res: res.groupDetail,
        price: res.groupDetail.projectInfo.so_price,
        project_id: res.groupDetail.project_id,
        y_day: y_day,
        startTime: startTime || '',
        activeType: res.groupDetail.status
      })

    })
  },
  sortT:function(a,b){
    return a.so_id - b.so_id
  },
  //报名轮播
  applyGroupUser: function (status){
    _api.applyGroupUser(status, res => {
      console.log(res,"报名轮播")
      let timestamp = Date.parse(new Date());
    var temp = [];
    var sortTemp = [];
    var clock =  ''
    for (let i of res.dataList){
      var date = new Date(i.enroll_time.replace(/-/g, "/")); date = date.getTime();
  
      //现在的时间戳
      var newDate = date/1000;   
      
      var endtimestamp =   timestamp - date;
 
      var y_day = Math.floor(endtimestamp / 86400000);

      var y_hou = Math.floor(endtimestamp / 3600000);
     
      var y_min = Math.floor(endtimestamp / 60000);
      var y_sec = Math.floor(endtimestamp / 1000)

      if (y_sec < 60 && y_min < 60 && y_hou < 24 ) {
        clock = y_sec + '秒'
      } else if(y_sec > 60 && y_min < 60 && y_hou < 24) {
        clock = y_min + '分钟'
      } else if (y_sec > 60 && y_min > 60 && y_hou < 24) {
        clock = y_hou + '小时'
      } else if (y_sec > 60 && y_min > 60 && y_hou >= 24){
        clock = y_day + '天'
      }
      i.clock  = clock
      i.t = parseInt(newDate)
    }
      temp = temp.concat(res.dataList);

      sortTemp = sortTemp.concat(res.dataList); //倒叙

      sortTemp.sort(this.sortT);

      this.setData({
        groupList: temp,
        sortTemp: sortTemp,
        load:true
      })
    })
  },
  //报名弹框显示
  modelShow: function (e) {
    console.log(e)
    this.setData({
      'orderModel.disTag': e.detail,
      'orderModel.classa': e.detail,
       
    })

  },
  //弹框接收值
  disTagHiden: function (e) {
    this.setData({
      'orderModel.classa': e.detail.classa
    })
  },
  disTagClass: function (e) {
    this.setData({
      'orderModel.disTag': e.detail.disTag
    })
  },

  onReady: function () {
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
            newuserNamescofs.userId = i.id;
            this.setData({
              newuserNamescofs: newuserNamescofs
            })
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(this.data.id,"this.data.id")
    this.groupDetail(this.data.id) //加载详情
    this.applyGroupUser(this.data.id) //报名轮播
    //选择报名信息返回值
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    let json = currPage.data.newuserNamescofs;
  },
  /**
   * 用户点击右上角分享
   */
    onShareAppMessage: function () {
    // activeType = 2 & id=2 & project_id=103

    let obj = {
      title: this.data.res.share_desc,
      url: "pages/y-indexDetail/y-indexDetail?status=" + this.data.activeType + '&id=' + this.data.id + '&shareType=1' + '&project_id=' + this.data.project_id,
      img: this.data.res.share_image_url
    }
    return _base.shareData(obj);
  }


})