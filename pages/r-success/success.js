// pages/r-success/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tip:{
      title:'',
      showBtn:false
    }
  },
    //拨打电话
    callPhone(e){
        let phone = e.target.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: phone
        })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let tip = this.data.tip;
      if(options.success === 'true'){
        tip.title = '签到成功';
        tip.showBtn = true;
      }else{
          tip.title = '签到失败';
          tip.showBtn = true;
      }
      this.setData({
          tip:tip
      })
  },
    back(){
        wx.reLaunch({
            url: '/pages/group/group?village_id=' + 22
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
