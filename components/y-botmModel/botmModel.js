// pages/Component/botmModel/index.js
import {
  Api
} from '../../utils/api.js';
import {
  login
} from '../../utils/login.js';

import {
  Base
} from '../../utils/base.js';

let _api = new Api();
let _login = new login();
let _base = new Base();
let app = getApp();
Component({
  properties: {
    startTime: {
      type: String,
      value: ''
    },
  //显示隐藏  
    disTag:{
      type:Boolean,
      value:false
    },
  //样式过渡  
    classa:{
      type: Boolean,
      value: false
    },
    //项目ID
    prictid:{
      type:String,
      value:''
    },
    //项目订金
    price:{
      type: String,
      value: ''
    },
    //项目状态
    status: {
      type: String,
      value: ''
    },
    //授权后的信息
    user: {
      type: Object,
      value: {}
    },
    appliedSum: {  //成团人数
      type: String,
      value: ''
    },
    groupSum: {  //要求成团人数
      type: String,
      value: ''
    },
    //选择联系人的
    newuserNamescofs: {
      type: Object,
      observer: function (data) {
        var that = this;
        console.log("Aaaaa",data)
        // if (data != '' || data!=null) {
          
        // }
      }
    },
    //groupId
    groupId:{
      type:String,
      value:''
    },
    imgurl:{
      type:String,
      value:''
    },
    shareName:{
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    endTime:'',
    isChange:false,
    index:0,
    dateTime1:'',
    userId:'',//联系人ID
    isLogin:Boolean
  },
  lifetimes: {
      ready() {

        this.diffState()

        var myDate = new Date();

        var myYear = myDate.getFullYear();  // 获取当前年份

        var myMonth = myDate.getMonth() + 1; // 获取当前月份

        var myDay = myDate.getDate() // 获取当前日（1- 31）

        var startTimeAll = myYear + '-' + myMonth + '-' + myDay;

        if (this.data.startTime){
          var startTime = new Date(this.data.startTime);
          startTime = startTime.getTime() / 1000;

          var newTimestamp = Date.parse(new Date()) / 1000;

          var startTimes = newTimestamp > startTime ? startTimeAll : this.data.startTime

          this.setData({
            startTime: startTimes,
            endTime: app.getNextMonth(startTimes)
          })
          
        }else{
          this.setData({
            startTime: startTimeAll,
            endTime: app.getNextMonth(startTimeAll)
          })
        }
        

        console.log(this.data.startTime,'startTime')
      }
    },  

  //组件生命周期
  pageLifetimes: {
    show: function () {
      if (this.data.newuserNamescofs){
        this.setData({
          userId: this.data.newuserNamescofs.id
        })
      }
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //获取默认联系人
    diffState:function(){
      var that = this;
      
    _api.seeContact((res) => {
      var newuserNamescofs = {};
        for(var i of res){
            if (i.is_default == 1) {
              newuserNamescofs.link_name = i.link_name;
              newuserNamescofs.link_mobile = i.link_mobile;
              newuserNamescofs.userId = i.id;
              that.setData({
                newuserNamescofs: newuserNamescofs
              })
            }
          }
      })
    },
    //日期选择器
    changeDateTime1(e) {
      this.setData({ dateTime1: e.detail.value, isChange: true });
    },
    tousers:function(e){
      wx.navigateTo({
        url: '/pages/my/my-contact/contact-list/contact-list'
      })
    },
    //提交订单
    formSubmit:function(e){
      var houseNum = e.detail.value.houseNum;
      var community = e.detail.value.community
      var area = e.detail.value.area;
      var date = e.detail.value.date;
      var data={
        village_name: community || '',
        house_check_group_id: this.data.groupId || '',
        project_id: this.data.prictid || '',
        user_link_id: this.data.newuserNamescofs.userId || this.data.userId,
        house_number: houseNum,
        pay_price: this.data.price,
        check_house_time:date,
        area:area
      }

      if(this.data.status==-1){
        data.group_type = 1  
        if (community == '') {
          this.toast('请填写小区名字');
          return
        }
      }
      console.log(this.data.user,"this.data.user.user_name")
      if (!this.data.user || !this.data.user.user_name) {
        this.toast('请填联系人信息');
        return
      }

      if (houseNum == '') {
        this.toast('请填写房屋号');
        return
      }
      if (area == '') {
        this.toast('请填写面积');
        return
      }
      if (date == '' || date == null) {
        this.toast('请填写预约时间');
        return
      }

      _api.submitSoInfo(data,res=>{
        console.log(res,"aa")

        this.pay(res.so_id)
      })
 
      
    },
    toast:function(text){
      _base.showToast(text, 'none');
    },
    pay(so_id) {
      var that = this;
      _api.pay(so_id, (res) => {
        console.log(res);
        console.log(res.data,'data');
        wx.requestPayment({
          'timeStamp': "" + res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': "prepay_id=" + res.data.prepay_id,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': function (res) {
            console.log("成功");
            if (res.errMsg == 'requestPayment:ok') {
              that.clear();
              wx.navigateTo({
                url: '/pages/y-orderSuccess/y-orderSuccess?status=' + that.data.status + '&id=' + that.data.groupId + '&project_id=' + that.data.prictid + '&imgurl=' + that.data.imgurl + '&name=' + that.data.shareName + '&appliedSum=' + that.data.appliedSum + '&groupSum=' + that.data.groupSum
              })

            }
          },
          'fail': function (res) {
            wx.navigateTo({
              url: '/pages/y-myorderHouse/y-myorderHouse',
            })
          }
        })
      });
    },
    //关闭弹框
    clear:function(){
      setTimeout(() => {
        this.triggerEvent('disTagHiden', { classa: false })
      },0)
      setTimeout(() => {
        this.triggerEvent('disTagClass', { disTag: false })
      }, 320)
    },

  },
})
