// pages/GroupTrim/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemSwiper:[
      { img:'http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190306144842/1001.png'},
      { img:'../../images/share.jpg'},
      { img: 'http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190306144842/1001.png' }
    ],
    cur:0,
    modelType:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  
  joinBtn(){
    this.setData({
      modelType:true
    })
  },
  hideModel(){
    this.setData({
      modelType: false
    })
  },
  tabClick(e){
    var item = e.currentTarget.dataset.item;
    this.setData({ cur: item})
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
//保存图片到本地
downImg(){
  wx.downloadFile({
    url: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/logo_white_fe6da1ec.png',
    success: function (res) {
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success: function (data) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1500
          })
        },
      })

    }
  })
},
//复制微信号码
  copy(){
    wx.setClipboardData({
      data: '微信号',
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
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