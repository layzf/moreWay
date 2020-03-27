// pages/sw-layout/sw-layout.js

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
    imgLoad:false,
    load:false,//暂无数据图片
    newVillage:[],
    categoryId:'',
    shareName: '',//分享时候的自定义名字
    shareUrl: '',//分享时候的自定义图片
    vilageNameId:'',//小区ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  bindload:function(){
    console.log('圖片加載完成')
    this.setData({
      imgLoad:true
    })
  },
  onLoad: function (options) {

    console.log(options, "asd")

//获取户型
    _api.selectBuildingList(options.id, res => {
      this.setData({
        newVillage: res,
      })
      if(res.length==''){
        this.setData({
          load: true
        })
      }
    })

    this.setData({
      vilageNameId: options.id,
      categoryId: options.categoryId,
      shareName: options.shareName,
      shareUrl: options.shareUrl
    })


  },

  _goDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    var buildname = e.currentTarget.dataset.buildname;
    var settleId = e.currentTarget.dataset.settleid;
    //有方案的小区 才能进 第二步选方案
    if (settleId != 0) {
      wx.navigateTo({
        url: '../sw-two-detail/index?typeSetp=1&id=' + id + '&categoryId=' + this.data.categoryId + '&shareName=' + this.data.shareName + '&shareUrl=' + this.data.shareUrl + '',
      })
    } else {
      _base.showAlert('此项目正在入驻中，敬请期待！')
    }
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
      url: "pages/sw-index/sw-index?shareCategoryId=" + this.data.categoryId + '&shareName=' + this.data.shareName + '&shareUrl=' + this.data.shareUrl + '',
      img: this.data.shareUrl
    }
    return _base.shareData(obj);
  }
})