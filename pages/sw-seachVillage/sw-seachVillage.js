// pages/sw-seachVillage/sw-seachVillage.js

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
    val:'',
    textLoad:false,
    load:false,
    userInfo:{},//用户信息
    villageList:[],

    seachVillage:{},
  },

/**非热门小区 */
  selectVillageList: function (seachText) {
    var filterArr = [];
    _api.selectVillageList('', res => {

      res.filter(item => {
        if (item.name.includes(seachText)) {
          filterArr.push(item)
        }
      })

      if (res.length == '' || filterArr.length==''){
        this.setData({
          load:true
        })
      }else{
        this.setData({
          load: false,
          textLoad:true  //有数据 或者 有关键词数据 则隐藏提示图片
        })
      }

      this.setData({
        villageList: filterArr
      })

    })
  },
  //用户信息
  selectCategoryList: function () {
    let userInfo = wx.getStorageSync('loginUser');
    this.setData({
      userInfo: userInfo
    })
  },
  onLoad: function (options) {

    let seachVillage = {
      categoryId: options.categoryId,
      shareName: options.shareName,
      shareUrl: options.shareUrl,
    }

    this.setData({
      seachVillage: JSON.stringify(seachVillage)
    })

    
  },

  //键盘事件
  _bindinput:function(e){
    console.log(e)
    if(!e.detail.cursor){
     this.setData({
       villageList: [],
       load:false,
       textLoad: false
     })
    }else{
      this.setData({
        val: e.detail.value
      })
    }
  },
  

  //键盘右下角搜索
  confirm: function (e) {
    this.selectVillageList(this.data.val || e.detail.value);
  },
  //清空输入框
  cancelClick: function () {
    this.setData({
      val: '',
      villageList: [],
      load: false,
      textLoad:false
    })
  },
  //选择小区
  _changeVillage: function (e) {
    var name = e.currentTarget.dataset.name;

    wx.setStorageSync('changeVillageName', name);

    var id = e.currentTarget.dataset.id;

    let { categoryId, shareName, shareUrl } = JSON.parse(this.data.seachVillage)

    wx.navigateTo({
      url: `../sw-layout/sw-layout?id=${id}&categoryId=${categoryId}&shareName=${shareName}&shareUrl=${shareUrl}`,
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
    this.selectCategoryList()
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
    let obj = {
      title: this.data.shareName,
      url: "pages/sw-index/sw-index?shareCategoryId=" + this.data.categoryId + '&shareName=' + this.data.shareName + '&shareUrl=' + this.data.shareUrl + '',
      img: this.data.shareUrl
    }
    return _base.shareData(obj);
  }
})