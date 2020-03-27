import { Base } from '../../../../utils/base.js';
import { Api } from '../../../../utils/api.js';
var _base = new Base();
var _api = new Api();
Page({
  data: {
    area:'',
    door:'',
    customItem:'全部',
    region:['湖南省','长沙市','岳麓区']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
  },

  bindRegionChange:function(e){
      this.setData({
          region: e.detail.value
      })
  },

  addressInput: function (e) {
    let id = e.target.id;
    let val = e.detail.value;
    console.log('val',val);
    if(id === 'area'){
        this.setData({
            area:val
        })
    }else{
        this.setData({
            door:val
        })
    }
  },

  formValidateSubmit: function (para) {
    var result = {
      status: false,
      msg: ''
    }
    // TODO: validate 选择所在地区
    if (!_base.validate(para.number, 'require')) {
      result.msg = '请输入详细地址';
      return result;
    }
    result.status = true;
    result.msg = '';
    return result;
  },

  onConfirmTap: function () {
    let region = this.data.region;
    let para = {};
    para.number = this.data.door;
    para.province_name = region[0];
    para.city_name = region[1];
    para.district_name = region[2];
    para.village_name = this.data.area;
    console.log(para);
    var validateResult = this.formValidateSubmit(para);
    if (!validateResult.status) {
      _base.showToast(validateResult.msg);
      return false;
    }
    _api.adress_add(para,(res)=>{
      _base.showToast('保存成功', 'success');
      setTimeout(() => {
        wx.navigateBack({
          delta:1
        })
        // wx.navigateTo({
        //   url: '/pages/my/my-address/address-list/address-list'
        // })
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