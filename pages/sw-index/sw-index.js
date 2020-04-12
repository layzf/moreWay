// pages/sw-index/sw-index.js
import { Api } from "../../utils/api";
import { Base } from "../../utils/base";
import { login } from '../../utils/login.js';

let _base = new Base();
let _api = new Api();
let _login = new login();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareName:'',//分享时候的自定义名字
    shareUrl: '',//分享时候的自定义图片
    villageList: [],

    userInfo:'',//用户信息 用来判断是否授权过(仅判断手机号授权)
    categoryId:'',//项目ID，现在  暂时为封窗的

    val: '',//搜索小区名字
    cursor: '',//搜索小区的光标位置
    vilageNameId: ''//小区ID

  },

  onLoad: function (options) {
    console.log(options,"options")
    this.selectVillageList();

    this.setData({
       categoryId: options.shareCategoryId,//项目ID
       shareName:options.shareName, //分享时 名字
       shareUrl: options.shareUrl,//分享时 图片
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
 
  //用户信息
  selectCategoryList:function(){
    let userInfo = wx.getStorageSync('loginUser');
    this.setData({
      userInfo: userInfo
    })
  },
  //小区接口 1 热门 0 非热门
  selectVillageList:function(){
    _api.selectVillageList(1,res => {
      console.log(res)
      this.setData({
        villageList:res
      })
    })
  },

  onShow: function () {
    this.selectCategoryList();
  },


  //选择小区
  _changeVillage: function (e) {

    var name = e.currentTarget.dataset.name;
    wx.setStorageSync('changeVillageName', name);

    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../sw-layout/sw-layout?id=${id}&categoryId=${this.data.categoryId}&shareName=${this.data.shareName}&shareUrl=${this.data.shareUrl}`,
    })

  },


  goLayout: function () {
    wx.navigateTo({
      url: `../sw-seachVillage/sw-seachVillage?shareName=${this.data.shareName}&shareUrl=${this.data.shareUrl}&categoryId=${this.data.categoryId}`,
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let obj = {
      title: this.data.shareName,
      url: "pages/sw-index/sw-index?shareCategoryId=" + this.data.categoryId + '&shareName=' + this.data.shareName + '&shareUrl=' + this.data.shareUrl+'',
      img: this.data.shareUrl
    }
    return _base.shareData(obj);
  }
})