// pages/sw-detail-img/sw-detail-img.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrimg:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var newArr = new Array  //图片

    var title = options.title //品牌名字

    var arrimg = decodeURIComponent(options.arrimg); arrimg = JSON.parse(arrimg)  //解码图片

    arrimg.forEach(item => {
      newArr.push(item.img_url)
    })
    
    wx.setNavigationBarTitle({  //title设置为品牌名字
      title: '返回'+title
    })

    this.setData({
      arrimg: newArr
    })

    
  },
  lookImg: function (e) {

    var imgs = e.currentTarget.dataset.img;

    wx.previewImage({
      current: imgs,
      urls: this.data.arrimg
    })

  },
  cancelClick:function(){
    wx.navigateBack({
      delta: 1
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