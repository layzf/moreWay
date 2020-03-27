// pages/y-orderSuccess/y-orderSuccess.js
import { Api } from "../../utils/api";
import { Base } from "../../utils/base";

let _base = new Base();
let _api = new Api();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    appliedSum: '',
    groupSum:'',
    status:'',
    project_id:'',
    id:'',
    imgurl:'',//图片banner
    name:'' //项目名字
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,"options")
    if (options.status){
      this.setData({
        status:options.status,
        project_id: options.project_id
      })
    }

    if (options.id) {
      this.setData({
        id: options.id
      })
    }

    this.setData({
      appliedSum: parseInt(options.appliedSum),
      groupSum: parseInt(options.groupSum)
    })

    this.shareText(options.status)
  },
  shareText:function(status){
    _api.qryShareByHouseCheckGroupStatus(status,res=>{
      this.setData({
        imgurl: res.img_url,
        name: res.content,
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
    var status = this.data.status == -1 ? 0 : this.data.status
    let obj = {
      title: this.data.name,
      url: "pages/y-indexDetail/y-indexDetail?status=" + status + '&id=' + this.data.id + '&shareType=1' + '&project_id=' + this.data.project_id,
      img: this.data.imgurl
    }

    return _base.shareData(obj);

    
  }
})