// pages/map/map.js
import {
  Base
} from '../../utils/base.js';
var _base = new Base();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:0,
    listData:[],
    markers:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let data = JSON.parse(options.data);
      let h = wx.getSystemInfoSync().windowHeight;
      this.mapCtx = wx.createMapContext('map');
      console.log('data',data);
      console.log('ctx',this.mapCtx);
      this.setData({
          height:h,
          listData:data,
          markers:data
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
    let data = this.data.listData;
      this.mapCtx.includePoints({
          points:data,
          success:function(res){
            console.log('res',res);
          },
          fail:function(err){
            console.log('err',err);
          }
      });
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
      url: "pages/map/map?data=" + JSON.stringify(this.data.listData)
    }
    return _base.shareData(obj);
  }
  
})
