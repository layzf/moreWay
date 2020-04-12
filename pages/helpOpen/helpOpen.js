import { Base } from '../../utils/base.js';
import { Api } from '../../utils/api.js';
var _base = new Base();
var _api = new Api();
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detailList: "",
    village_id:'',
    dataList:'',
    needPeople:'',
    percent:'',
    judgeJoin:false,
    judgeStart:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.judgeStart==1){
      this.setData({
        judgeStart: true
      })
    }
    _api.dealDetail(options.village_id,(res)=>{
      console.log(res);
      var needPeople = res.data.record.open_num - res.data.size;
      var percent = (res.data.size / res.data.record.open_num)*100;
      if (res.data.isapply==false){
        this.setData({
          judgeJoin: false
        })
      }else{
        this.setData({
          judgeJoin: true
        })
      }
      this.setData({
        village_id: options.village_id,
        detailList:res.data.record,
        dataList:res.data,
        needPeople: needPeople,
        percent: percent,
      })
    })
  },
  joinHelp:function(){
    var loginStatus = wx.getStorageSync("loginStatus");
    if (loginStatus==true){
      var that = this;
      _api.helpBecome(this.data.village_id, (res) => {
        console.log(res);
        _base.showToast("报名成功", "loading", 2000, function () {
          if (res.resultCode == 1000) {
            setTimeout(res => {
              wx.navigateTo({
                url: 'inviteFriend/inviteFriend?village_id=' + that.data.village_id,
              })
            }, 500)
          }
        })
      })
    }else{
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },

  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})