// pages/sw-inspectionGroup/sw-inspectionGroup.js

// pages/y-index/y-index.js
import { Api } from "../../utils/api";
import { login } from '../../utils/login.js';
import { Base } from "../../utils/base";


const throttles = require('../../utils/throttle.js')
let _api = new Api();
let _login = new login();
let _base = new Base();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formVal:{},//表格信息
    isLogin:true,//登录状态
    shareName:'',
    shareUrl:'',
    vilageNameId:'',//小区id
    beat:[],
    villageName:'',
    categoryId:'',
    changeNotMyVill:'',//val：1  没有我的小区，进入
    index: ''//int 聚焦的id用来判断 用户当前输入的输入框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,"options")
    if (options.hasOwnProperty('vilageNameId')){
      this.setData({
        vilageNameId: options.vilageNameId //小区id
      })
    }
//没有我的小区
    if (options.changeNotMyVill==1){
      this.setData({
        villageName: wx.setStorageSync('changeVillageName',''),
        changeNotMyVill: options.changeNotMyVill
      })
    }
    this.setData({
      categoryId: options.categoryId,
      shareName:options.shareName,
      shareUrl: options.shareUrl,
    })

    this.selectCategoryAttrList();

  },

  //输入框循环
  selectCategoryAttrList: function () {

    this.setData({
      villageName: wx.getStorageSync('changeVillageName')
    })

    _api.selectCategoryAttrList(res => {
   
      var beat = res;
      for (let i = 0; i < beat.length; i++) {
        beat[i].indexs = i;
        beat[i].vals=''
      }

      _api.rzEnrollRecordList(this.data.vilageNameId || 0,resp => {

        if (resp) {

          for (let i = 0; i < resp.categoryAttrList.length; i++) {
          
            for (let j = 0; j < beat.length; j++) {
              beat[i].vals = resp.categoryAttrList[i].val
            }

          }
//有户型的时候 不显示小区名字
          if (this.data.villageName == ''){
            this.setData({
              villageName: resp.adress,
            })
          }
          
        }
        this.setData({
          beat: beat
        })

      })

    })
  }, 


  //手机号登录
  wxLogin(e) {
    let that = this;
    let sessionId = wx.getStorageSync("sessionId");

    let data = e.detail.encryptedData;
    let iv = e.detail.iv;
    console.log('data:', data, "iv:", iv, 'sessionId:', sessionId)

    if (e.detail.errMsg === "getPhoneNumber:ok") {
      _api.wxLogin({ data: data, iv: iv }, res => {

        if (res.resultCode === 1000) {
          wx.setStorageSync("loginStatus", res.data.loginstatus);
          wx.setStorageSync("loginUser", res.data.loginUser);

          that.setData({
            isLogin: true
          });
          this.beatArrFunction(this.data.formVal)
        }
      })
    }
  },
  //提交按钮
  submit:function(e){
    this.submitFunction(e)
  },

  submitFunction:function(e){
    var val = e.detail.value;
    var villageName = val.villageName;
    wx.setStorageSync('changeVillageName', villageName);


    var arr = []
    for (let i in val) {
      arr.push(val[i]); //属性
    }
 
   var isUndefinder = arr.every(item=> item!='')

    if (!isUndefinder){
      _base.showToast('请补全信息', 'none')
      return false
    }
    this.setData({
      formVal: val
    })

    this.beatArrFunction(val)
 
   
  },
  beatArrFunction(val){
    console.log(val,"Ad")
    var beat = this.data.beat;//循环有多少输入框

    var enrollRecordDetail = [];

    var enroll = []

    for (let i = 0; i < beat.length; i++) {
      var betArr = beat[i];
      enrollRecordDetail.push({ 'category_attr_id': betArr.id, 'val': val['key_' + betArr.id] });
      enroll.push({ 'name': betArr.show_name, 'val': val['key_' + betArr.id], 'unit': betArr.unit, 'desc_url': betArr.desc_url });
    }

    var data = {
      adress: val.villageName,
      use_village_id: this.data.vilageNameId,
      enrollRecordDetailList: enrollRecordDetail
    }

    _api.addOrUpdate(JSON.stringify(data), res => {

      if (res.resultCode === 1002) {
        console.log('未登录')
        return
      }

      _api.rzEnrollRecordList(this.data.vilageNameId == '' ? 0 : this.data.vilageNameId, resp => {
        let summariesJson = JSON.stringify(resp.categoryAttrList)
        summariesJson = encodeURIComponent(summariesJson)

        wx.navigateTo({
          url: '../sw-three-detail/index?typeSetp=2&data=' + JSON.stringify(enroll) + '&summariesJson=' + summariesJson + '&categoryId=1' + '&shareName=' + this.data.shareName + '&shareUrl=' + this.data.shareUrl + '',
        })
      })

    })

  },
  //只能输入小数点后两位
  bindinputs:function(e){
    var typesId = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;

    var beat = this.data.beat;
    var vals = null

    for (var i = 0; i < beat.length; i++) {
      if (typesId == beat[i].id) {

        if (/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value)) {
          //  没有超过小数点后两位
          beat[i].vals = e.detail.value;
        } else {
          //超过小数点后两位
          beat[i].vals = e.detail.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
        }

      }
    }

    var isNullb = beat.every(item => item.vals != '')  //填完信息后显示按钮的正确状态

    if (isNullb){
      let state = wx.getStorageSync('loginStatus');
      this.setData({
        isLogin: state
      })
    }else{
      this.setData({
        isLogin: true
      })
    }

    this.setData({
      ids: typesId,
      beat: beat,
      index: index
    })

  },
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

    let obj = {
      title: this.data.shareName,
      url: "pages/sw-inspectionGroup/sw-inspectionGroup?categoryId=" + this.data.categoryId + '&shareName=' + this.data.shareName + '&shareUrl=' + this.data.shareUrl + '',
      img: this.data.shareUrl
    }
    return _base.shareData(obj);

  }
})