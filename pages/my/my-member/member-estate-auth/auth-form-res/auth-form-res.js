import {
  Base
} from '../../../../../utils/base.js';
import {
  Api
} from '../../../../../utils/api.js';
var _api = new Api();
var _base = new Base();
Page({
  data: {
    failStatus:false,
    commitSuccess:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if(options.fail==1){
      this.setData({
        failStatus:true
      })
    } else if (options.commitSuccess==1){
      this.setData({
        commitSuccess:true
      })
    }
  },
  contactMy:function(){
    wx.makePhoneCall({
      phoneNumber: '15629083308'
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
    _api.diffState((res) => {
      console.log(res);
      this.setData({
        err_msg: res.data.userInfo.userAut.err_msg
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
  // onUnload: function () {
  //   // console.log('onUnload');
  //   wx.navigateBack({
  //     delta: 1
  //   })
  // },

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