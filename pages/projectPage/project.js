// pages/projectPage/project.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     let imgs = JSON.parse(options.img);
     this.setData({imgs:imgs});
  },

})
