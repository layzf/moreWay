// pages/enroll-success/success.js

import {
  Api
} from '../../utils/api.js';
import {
  Base
} from '../../utils/base.js';

var _api = new Api();
var _base = new Base();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    share: false,
    pageIndex: 1,
    pageSize: 8,
    list: [], //商品列表
    load:false
  },


  onLoad: function(options) {
    this.setData({
      share: options.share ? options.share : false
    })
    this.getHotProduct(this.data.pageIndex, this.data.pageSize)

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
//关闭报名弹框
    prevPage.setData({
        showLogin: false,
        mask: false 
    })
  },

 
  detailShoop:function(e){
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../shopDetail/shop?id=' + item.id + '&pid=' + item.projectId+'&enroll='+true
    })
  },
  getHotProduct: function(pageIndex, pageSize) {
    _api.getHotProduct(pageIndex, pageSize, (res) => {
      if(res.length==0){
        this.setData({
          load:true
        })
        return
      }
      
      Array.prototype.push.apply(this.data.list, res)
      this.setData({
        list: this.data.list,
        pageIndex: this.data.pageIndex+1
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
   
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    //活动页面提交信息 隐藏报名弹框
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      onHideeroll: false
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.load) {
      this.getHotProduct(this.data.pageIndex, this.data.pageSize)
    } else {
      wx.showToast({
        title: '暂无数据',
        icon: "none"
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})