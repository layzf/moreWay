import { Base } from '../../../utils/base.js';
import { Api } from '../../../utils/api.js';
var _base = new Base();
var _api = new Api();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectList:'',
    collectImg:'',
    currentSwiper:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    _api.collectPrice(options.collectId,(res)=>{
      console.log(res);
      this.setData({
        collectList:res.data.dto,
        collectImg: res.data.list
      })
    })
  },
  imgYu:function(e){
    console.log(e);
    var img_url = e.currentTarget.dataset.img_url;
    var allImg = this.data.collectImg;
    var total=[];
    for (var i = 0; i < allImg.length;i++){
      total.push(allImg[i].img_url);
    }
    wx.previewImage({
      current: img_url,
      urls: total
    })
  },

  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
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