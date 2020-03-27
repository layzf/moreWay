// pages/association/index.js
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
    commanderHiden: false, //1
    showTab: Boolean, //1
    height:'',//1
    url:'http://img-test.duorang.com/upload/adv/2019/8/29/b5616c1d-d208-46f8-a910-c2a33ceb1fa1.png',
    curr:0,
    radioCurr:1,

    radioItems: [
      { name: '项目评论', value: '1', checked: 'true'  },
      { name: '疑难解答', value: '2'},
      { name: '活动现场', value: '3' },
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let h = wx.getSystemInfoSync().windowHeight;
    this.setData({
      height:h
    })
  },

  //第一级tab切换
  currClick:function(e){
    var curs = _base.getDataSet(e,'cur')
    this.setData({
      curr: curs
    })
  },
  //第二级tab切换
  radioChange: function (e) {
    this.setData({
      radioCurr: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', this.data.radioCurr)
  },

  postSave(e) {
    // this.selectComponent("#postSave").postSaveClick();

  },

  
  //咨询团长
  callCapital() {
    let h = wx.getSystemInfoSync().windowHeight;
    this.selectComponent('#my-commander').getInfo()
    this.setData({
      height: h,
      commanderHiden: true,
      showTab: false
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