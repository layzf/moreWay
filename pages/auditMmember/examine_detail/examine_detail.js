import { Base } from '../../../utils/base.js';
import { Api } from '../../../utils/api.js';
var _base = new Base();
var _api = new Api();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    let id = options.id
    that.setData({
      id:id
    })
    _api.examine_detail(id,(res) => {
      let arr = res.data.record.door_number.split("-");
      console.log(arr);
      if (arr.length<3){
        that.setData({
          door_number1: arr[0],
          door_number2: "",
          door_number3: arr[1],
        })
      }else{
        that.setData({
          door_number1: arr[0],
          door_number2: arr[1],
          door_number3: arr[2],
        })
      }
      that.setData({
        user_id: res.data.userinfo.user_name,
        card_img: res.data.record.card_img,
        certificate_img: res.data.record.certificate_img,
        mobile: res.data.userinfo.mobile,
        village_name: res.data.villageInfo.village_name,
      })
    })
  },
  bindKeyInput1(e){
    this.setData({
      door_number1: e.detail.value
    })
  },
  bindKeyInput2(e) {
    this.setData({
      door_number2: e.detail.value
    })
  },
  bindKeyInput3(e) {
    this.setData({
      door_number3: e.detail.value
    })
  },
  applyPlace(e){
    this.setData({
      updateVillage: e.detail.value
    })
  },
  through(){
    let that=this;
    let door_number;
    var editVillage;
    if (!that.data.door_number2) {
      door_number = that.data.door_number1 + "-" + that.data.door_number3
    } else {
      door_number = that.data.door_number1 + "-" + that.data.door_number2 + "-" + that.data.door_number3;
    }
    console.log(door_number);
    if (that.data.village_name =='体验小区'){
      editVillage = that.data.updateVillage;
    }else{
      editVillage = that.data.village_name
    }
    wx.showModal({
      title: "",
      content: "一旦通过，用户信息将不可修改，是否确认通过",
      showCancel: true,
      cancelText: '确定',
      cancelColor: '#FF5D22',
      confirmText: '取消',
      confirmColor: '#999999',
      success: function (res) {
        if (res.cancel == true) {
          _api.pass(that.data.id, door_number, editVillage, (res) => {
            _base.showToast('操作成功', 'success');
            setTimeout(function () {
              wx.navigateBack({
                delta:2
              })
              // wx.navigateTo({
              //   url: '../member_list/member_list'
              // })
            }, 1000)
          });
        }
      }
    })
  },
  not_through(){
    let that = this;
    // if (!that.data.door_number1 || !that.data.door_number2 || !that.data.door_number3) {
    //     _api.showToast('请完善地址')
    //     return false;
    // }
    that.setData({
      show: true,
    })
  },
  bindTextAreaBlur(e){
    this.setData({
      err_msg:e.detail.value
      })
  },
  sub(){
    let that = this;
    let err_msg = that.data.err_msg
    if (!err_msg){
      _api.showToast('请填写原因')
      return false;
    }

    let door_number 
    if (!that.data.door_number2){
      door_number = that.data.door_number1 + "-" + that.data.door_number3
    }else{
      door_number=that.data.door_number1 + "-" + that.data.door_number2 + "-" + that.data.door_number3;
    }
    console.log(door_number);
   
    _api.no_pass(that.data.id, door_number, err_msg,(res) => {
      _base.showToast('操作成功', 'success');
      that.bg_show();
      setTimeout(function(){
        wx.navigateBack({
          delta: 2
        })
        // wx.navigateTo({
        //   url: '../member_list/member_list'
        // })
      },1000)
    });
  },

  bg_show(){
    this.setData({
      show:false,
      })
  },
  call_phone(){
    wx.makePhoneCall({
      phoneNumber: this.data.mobile //仅为示例，并非真实的电话号码
    })
  },
  openImg_left:function(){
    var code = this.data.card_img;
    wx.previewImage({
      current: '',
      urls: [code]
    })
  },
  openImg:function(){
    var code = this.data.certificate_img;
    wx.previewImage({
      current:'',
      urls: [code]
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
    return {
      title: '开通助力',
      path: "pages/index/index",
      success: function (res) {
        _base.showToast('分享成功', 'success');
      },
      fail: function (res) {
        // _base.showToast('取消分享');
      }
    }
  }
})