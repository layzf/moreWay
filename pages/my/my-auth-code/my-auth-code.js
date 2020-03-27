import { Base } from '../../../utils/base.js';
import { Api } from '../../../utils/api.js';
var _base = new Base();
var _api = new Api();
Page({
  /**
   * 页面的初始数据
   */
  data: {
      code:"",
      icon:"",
      user_name:"",
      integral_num:"",
      alreadyTime:'',
      mallTime:false,
      villageApply:''
  },
  dd:function(){
    wx.previewImage({
      urls: [this.data.code],
      current: this.data.code, // 当前显示图片的http链接
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.hideShareMenu();
    let token = wx.getStorageSync("token");
    let tokenid = wx.getStorageSync("tokenid");
    _api.my_auth((res) => {
      console.log(res);
      that.setData({
        icon: res.data.icon,
        user_name: res.data.user_name,
        integral_num: res.data.integral_num
      })
      wx.downloadFile({
          url: _base.baseRequestUrl + 'usercode/getUserCode.json?token=' + token + '&tokenid=' + tokenid,
          success: function (res) {
            console.log(res);
            that.setData({
              code: res.tempFilePath
            })
          }
        })

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
      var obj = res.data.userInfo;
      if (obj.villageApply != null) {
        this.setData({
          villageApply: obj.villageApply,
        })
      }else{
        console.log(res);
        this.setData({
          villageContent: obj.userAut,
        })
        if (obj.userAut && obj.userAut.is_activate == 1) {
          var date = new Date(obj.userAut.end_at.replace(/-/g, '/'));
          var time2 = date.getTime();
          var timestamp = Date.parse(new Date());
          if (timestamp > time2) {
            this.setData({
              mallTime: true
            })
          }
        }
      }
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
