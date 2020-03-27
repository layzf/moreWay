// pages/collect/result-submit/result-submit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:'',
    url:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      options:options
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
    if (this.data.options.judgeResult==1){
      var url = "/pages/collect/collect/collect?collectId=" + this.data.options.collectId;
      this.setData({
        url: url
      })
    }else{
      var url = "/pages/collect/collectPreview/collectPreview?base_id=" + this.data.options.base_id + '&villageId=' + this.data.options.villageId;
      this.setData({
        url: url
      })
    }
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
    console.log(this.data.url);
    return {
      title: '多让',
      imageUrl: this.data.options.img_url,
      path: this.data.url,
      success: function (res) {
        _base.showToast('分享成功', 'success');
      },
      fail: function (res) {
        // _base.showToast('取消分享');
      }
    }
  }
})