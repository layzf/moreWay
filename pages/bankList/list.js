// pages/bankList/list.js
// pages/applyCash/cash.js
import {Api} from "../../utils/api";
import {Base} from "../../utils/base";
import {login} from '../../utils/login.js';

let _base = new Base();
let _api = new Api();
let _login = new login();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:'',
      cardList:[],
      type:''
  },

  addCard(){
    wx.navigateTo({
      url: '../bankCard/bankCard'
    })
  },

  chooseBank(e){
    let list = this.data.cardList;
    let index = e.currentTarget.id;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length -2]
    prevPage.setData({
        card:list[index]
    })
    wx.navigateBack({
        delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    let h = wx.getSystemInfoSync().windowHeight;
    this.setData({
        height:h,
        type:options.type
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
     let that = this;
      _api.searchPersonBank(res=>{
        that.setData({
            cardList:res
        })
      })
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
