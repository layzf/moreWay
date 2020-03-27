// pages/y-myorderHouse/y-myorderHouse.js
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
    current:1,
    type1:[],
    load:false,
    orderInformation:{},
    height: '',
    commanderHiden:'' ,
    showTab:'' 

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,"optionsoptions")
    if (options.current){
      this.setData({
        current: parseInt(options.current)
      })
    }
  },

//查看评论
  lookDetail: function (e) {
    console.log(e,"asda")
    var lookType = e.currentTarget.dataset.look;

    var id = e.currentTarget.dataset.applyid

    wx.navigateTo({
      url: `../y-assess/y-assess?applyId=${id}&lookType=${lookType}`,
    })
  },

  //咨询团长
  linkTeam(e) {
    var team = e.currentTarget.dataset.group;
    console.log(team,"team")
    let h = wx.getSystemInfoSync().windowHeight;
    var obj = {
      name: team.group_link_name,
      tell: team.group_link_mobile,
      group_link_icon: team.group_link_icon,
      group_link_wx: team.group_link_wx,
      applied_sum: team.applied_sum,
    }
    this.setData({
      orderInformation: obj,
      height: h,
      commanderHiden: true,
      showTab: false
    })
  },

//申请 取消订单
  cancelApplyGroup:function(e){
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '是否要取消订单',
      showCancel: true,
      confirmText: "确定",
      confirmColor: "#E94816",
      success: res => {
        if (res.confirm == true) {
          _api.cancelApplyGroup(id, res => {
            this.queryApply(1);
          })
        } else {
          console.log('取消申请订金');
        }
      }
    })
  },
  queryApply: function (type){
    _api.queryApply(type,res=>{
      console.log(res,"aa")
      this.setData({
        type1: res,
        load:true
      })
    })
  },
  clickOrder:function(e){
    var type = e.currentTarget.dataset.type;
    this.setData({
      current:type,
      load:false
    })
    this.queryApply(type)
  },
  //退订金
  socancel:function(e){
    var id = e.currentTarget.dataset.id;
    var soId = e.currentTarget.dataset.soid;
    console.log(soId, id)
    var data={
      id: id,
      soId: soId
    }

    wx.showModal({
      title: '提示',
      content: '是否要退订金',
      showCancel: true,
      confirmText: "确定",
      confirmColor: "#E94816",
      success: res => {
        if (res.confirm==true){
          _api.socancel(data, res => {
            console.log(res, "aaa")
            this.queryApply(1);
          })
        }else{
          console.log('取消申请订金');
        }
      }
    })

    
  },
  //去支付
  goPay:function(e){
    console.log(e,"aaaa")
    let items = e.currentTarget.dataset.items
    this.pay(items.so_id, items.houseCheckGroup)
  },

  pay(so_id,e) {
    var that = this;
    _api.pay(so_id, (res) => {
     
      wx.requestPayment({
        'timeStamp': "" + res.data.timeStamp,
        'nonceStr': res.data.nonceStr,
        'package': "prepay_id=" + res.data.prepay_id,
        'signType': res.data.signType,
        'paySign': res.data.paySign,
        'success': function (res) {
          console.log("成功");
          if (res.errMsg == 'requestPayment:ok') {
                wx.navigateTo({
                  url: '/pages/y-orderSuccess/y-orderSuccess?status=' + e.status + '&id=' + e.id + '&project_id=' + e.project_id + '&imgurl=' + e.image_url + '&name=' + e.name + '&appliedSum=' + e.applied_sum + '&groupSum=' + e.can_group_sum
              })

          }
        },
        'fail': function (res) {
        }
      })
    });
  },

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.current==1) {
      this.queryApply(1);
    } else {
      this.queryApply(0);
    }

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