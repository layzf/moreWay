import { Base } from '../../../../utils/base.js';
import { Api } from '../../../../utils/api.js';
var _base = new Base();
var _api = new Api();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    region:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    wx.hideShareMenu();
     let data = JSON.parse(options.data);
     let region = this.data.region;
     region.push(data.province_name);
     region.push(data.city_name);
     region.push(data.district_name);
    this.setData({
      address: data,
      region:region
    })
  },

  bindRegionChange:function(e){
      this.setData({
          region: e.detail.value
      })
  },

  addressInput: function (e) {
    let address = this.data.address;
    let id = e.target.id;
    let val = e.detail.value;
    if(id==='area'){
        address.village_name = val;
    }else{
        address.door_number = val;
    }
    this.setData({
        address:address
    })
  },

  formValidateSubmit: function (para) {
    var result = {
      status: false,
      msg: ''
    }
    if (!_base.validate(para.village_name, 'require')) {
      result.msg = '请输入小区名';
      return result;
    }
    result.status = true;
    result.msg = '';
    return result;
  },

  onConfirmTap: function () {
    let address = this.data.address;
    let para = {};
    para.id = address.id;
    para.village_name = address.village_name;
    para.number = address.door_number;
    para.province_name = address.province_name;
    para.city_name = address.city_name;
    para.district_name = address.district_name;
    console.log(para);
    var validateResult = this.formValidateSubmit(para);
    if (!validateResult.status) {
      _base.showToast(validateResult.msg);
      return false;
    }
    _api.adress_doupdate(para, (res) => {
      _base.showToast('保存成功', 'success');
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        });
      }, 500);
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