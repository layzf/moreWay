import { Base } from '../../../../utils/base.js';
import { Api } from '../../../../utils/api.js';
var _api = new Api();
var _base = new Base();
Page({
  data: {
    groupObj: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("这是");
     console.log(options);
     let id = options.id;
    _api.view_evaluation(id, (res)=>{
      console.log(res);
      let groupObj={};
      groupObj.create_at = res.data.create_at;
      groupObj.content = res.data.content;
      groupObj.evalute_type = res.data.evalute_type;
      groupObj.score = res.data.score;
      groupObj.img_url1 = res.data.img_url.split(";");
      groupObj.label = res.data.label.split(";");

      groupObj.village_name = res.data.dataList.activity_name;
      groupObj.img_url = res.data.dataList.img_url;
      groupObj.prod_price = res.data.dataList.prod_price;
      groupObj.project_name = res.data.dataList.project_name;
      this.setData({
        groupObj: groupObj
      });
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