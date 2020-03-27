// pages/y-index/y-index.js
import { Api } from "../../utils/api";
import { Base } from "../../utils/base";
import { login } from '../../utils/login.js';

let _base = new Base();
let _api = new Api();
let _login = new login();

const throttles = require('../../utils/throttle.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    load:true,
    changeModel:false,//验房方式弹框
    arrTab:['全部','正在组团','已成团','已结束'],
    current:'',//tab切换的索引
    homepage:[],//首页图片
    list:[],//验房团列表
    intVal:'',//搜索小区的字符串
    cursor:'',//输入框光标
    heights:0, //容器高度
    tabTop:'',//tab距离顶部高度
    fixedNav:false,
    page:1,
    pagesize:10,
    fixedClass:false,//tab切换 固定定位开关
    listNum:true,//上拉开关
    notLower:false,//是否上拉记载触发加载

    userInfo:'',//用户授权信息
    userId:''//用户id
  },


onLoad: function (options) {
  this.homepage() //首页图片

},

homepage:function(){
  _api.homepage(res => {
    this.setData({
      homepage:res
    })
  })
},

getReact:function(){
  var that = this;
  wx.createSelectorQuery()
    .select(".joins")
    .boundingClientRect(function (rect) {
     that.setData({
       heights:rect.height
     })
    })
    .exec();
},
//banner图加载完成后获取 tab距离顶部高度
  imgload:function(e){
    var that = this;
    wx.createSelectorQuery().select('#tab').boundingClientRect(function (rect) {
      that.setData({
        tabTop:rect.top,
        load: false
      })
    }).exec()
  },

  list: function (callback){
  var data = {
    name: this.data.cursor ? this.data.intVal : '',
    status: this.data.current,
    page:this.data.page,
    pagesize:this.data.pagesize
  }
  _api.groupList(data,res=>{
  // let timestamp = Date.parse(new Date());  倒计时为0判断，待定....
  //   var temp = [];
  //   let index = 0;
  //   for(let i of res){
  //      if(i.status ==1){
  //        if (timestamp > new Date(i.end_enroll_time.replace(/-/g, '/'))) {
  //          i.isOver = true;
  //          index++;
  //        } else {
  //          i.isOver = false;
  //        }
  //      }
  //    }
  //   temp = temp.concat(res);
    if(res==''){
      this.setData({
        listNum:false
      })
    }else{
      if (this.data.notLower){  //上拉加载的数据
        var lists = this.data.list;
        lists = lists.concat(res)
        this.setData({
          list: lists
        })
      }else{
        this.setData({
          list: res
        })
      }
    }
  
    typeof (callback) === 'function' && callback(this.data.notLower?lists:res)
  })
},
//上拉加载
  onReachBottom: function () {
    if (this.data.listNum) {
      this.setData({
        page: this.data.page + 1,
        notLower: true
      })
      this.list((res) => {
        //有关键字
        if (this.data.cursor && res) {
          this.setData({
            list: this.filterList(res, this.data.intVal)
          })
        }
      });
    } else {
      _base.showToast('暂无数据', 'none');
    }
  },
  // onPageScroll:function(e){
  //   if (e.scrollTop >= this.data.tabTop){
  //     console.log(1)
  //     this.setData({
  //       fixedClass:true
  //     })
  //   }else{
  //     console.log(2)
  //     this.setData({
  //       fixedClass: false
  //     })
  //   }
  // },


  //tab切换
  tabClick:function(e){
    var i = e.currentTarget.dataset.index;
    this.setData({
      current: i ? i : '',
      page: 1,
      //还原初始值
      notLower:false, 
      listNum:true
    })
    this.list((res)=>{
      if (this.data.cursor) {
        this.setData({
          list: this.filterList(res, this.data.intVal)
        })
      }else{
        this.setData({
          list: res
        })
      }
      this.getReact()
    });
  },
  //申请开通验房小区弹框显示
  modelShow:function(){
    this.setData({
      changeModel:true
    })
  },
  //关闭验房小区弹框
  closeModel:function(){
    this.setData({
      changeModel:false
    })
  },
  //键盘右下角搜索
  confirm:function(e){
    var es = {
      detail:{
        value: e.detail.value,
        cursor: e.detail.value.length
      }
    };
    this.bindInput(es)
  },
  //搜索我的验房团
  bindInput:function(e){
    console.log('bindInput:',e)
    var off = false;

    var cursor = e.detail.cursor;

    var val = e.detail.value;

    this.setData({
      intVal: val,
      cursor: cursor,
      page:1,
      //还原初始值
      listNum: true,
      notLower: false
    });

    this.list((res) => {
      if (this.data.cursor) {
        this.setData({
          list: this.filterList(res, val)
        })
      }
      this.getReact()
    });
  },
  //组团列表过滤
  filterList:function  (res,text){
    // res:过滤的数组，text：过滤值
    var newlist = [];
    res.filter(item => {
      if (item.name.includes(text)) {
        newlist.push(item)
      }
    })
    return newlist
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    
    this.list(res => {
      this.getReact()
    })  //验房团列表


    let userInfo = wx.getStorageSync('loginUser');
    if (userInfo != '') {
      this.setData({
        userId: userInfo.id
      })
    } else {
      userInfo: userInfo
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
      this.setData({
        changeModel:false
      })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})