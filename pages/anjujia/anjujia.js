// pages/anjujia/anjujia.js

import {
  Base
} from '../../utils/base.js';

import { Api } from "../../utils/api";
var _base = new Base();
let _api = new Api();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginStatus:false,
    imgs:[
      { 
        'img': 'http://img-test.duorang.com/upload/adv/2019/8/29/dae31e61-5eb3-4606-baa2-e8caea48fff8.png', 
        'name': '多让集采 | 安居佳全屋定制（马王堆店）', pid: 37, pepoleNum: 196
        },
      { 
        'img': 'http://img-test.duorang.com/upload/adv/2019/8/29/cda29532-896a-4033-b2c0-26a9dcff5a40.png',
        'name': '多让集采 | 安居佳全屋定制（梅溪湖店）', pid: 77, pepoleNum: 263
       },
      {'img': 'http://img-test.duorang.com/upload/adv/2019/8/29/1a51e3ee-f044-421d-8529-1f5799e0f597.png',
        'name': '多让集采 | 安居佳全屋定制（望城店）', pid: 78, pepoleNum: 218
       }
    ],
    kou:[
      'http://img-test.duorang.com/upload/adv/2019/9/2/77fcd71d-a6da-4bcf-a12f-617174b477f9.jpg',
      'http://img-test.duorang.com/upload/adv/2019/9/2/bb3ae009-804a-42e4-a7fc-98222bdf3703.jpg',
      'http://img-test.duorang.com/upload/adv/2019/9/2/4df86a0b-c8e1-4d54-a7ed-49d585eb7ebd.jpg',
      'http://img-test.duorang.com/upload/adv/2019/9/2/ef2e99ba-4c5a-481a-bdd5-79d034548237.jpg'
    ],
    img:[
      'http://img-test.duorang.com/upload/adv/2019/9/4/1f2573d9-5c46-4e95-824d-4a48243ee216.jpg',
      'http://img-test.duorang.com/upload/adv/2019/9/4/434beb18-a6fb-43c1-a573-78e4fb74f5f1.jpg',
      'http://img-test.duorang.com/upload/adv/2019/9/4/0b9d57d7-4ec0-4245-be45-09172a991a5b.jpg',

      'http://img-test.duorang.com/upload/adv/2019/9/4/f1e2f7bf-d128-4f64-af2e-bc2a18d814ba.jpg',
      'http://img-test.duorang.com/upload/adv/2019/9/4/27c7f994-eb31-4925-8d4f-99377579a49c.jpg',
      'http://img-test.duorang.com/upload/adv/2019/9/4/1eaa032e-8dad-43b6-91ee-7f211cdd4b7e.jpg',
      'http://img-test.duorang.com/upload/adv/2019/9/4/618232e8-9ebe-4c2e-a9e8-d14df773fe77.jpg',
      'http://img-test.duorang.com/upload/adv/2019/9/4/c0b7338f-f469-493d-bbfd-461c9b4607cc.jpg',

      'http://img-test.duorang.com/upload/adv/2019/9/4/b90e8411-9764-43ca-adee-f2ad5361497f.jpg',
    ],
    height:0,
    showTab: Boolean,
    commanderHiden: false,
    shareHome:false//是否是分享
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.shareType==1){
      let h = wx.getSystemInfoSync().windowHeight

      this.setData({
        shareHome:true,
        height:h
      })
    }
    if (options.keys==='anjujia'){
      setTimeout(() => {
        this.goTap()
      }, 1000)
    }
    
  },
 
  //跳转到首页
  returnHome() {
    wx.reLaunch({
      url: '/pages/group/group?village_id=22&shareAfter=1'
    })
  },
  //咨询团长
  callCapital() {
    let h = wx.getSystemInfoSync().windowHeight;
    this.selectComponent('#my-commander').getInfo()
    this.setData({
      height: h,
      commanderHiden: true,
      showTab: false
    })
  },

  goTap:function(e){
   wx.pageScrollTo({
     duration:800,
     selector: '#top'
   })
  },
//跳转到交付定金页面
  orderBtns:function(e){
    var pid = e.currentTarget.dataset.id;
    let c = {
      id: pid,
    }
//pid 这是安居佳id标识，提交数据用到
    _api.toSubscription(c, res => {
      wx.navigateTo({
        url: '/pages/my/my-deposit/deposit-add2/deposit-add?id=37&type=1&pid=' + pid + '&data=' + res.data.valid_days + ''
      })
    })

   
  },
  prerView:function(e){
    var ed = e.currentTarget.dataset.ed;
    var imgArr=''
    if (ed==1){
      imgArr = this.data.img;
    }else{
      imgArr = this.data.kou;
    }
    this.lookImg(e, imgArr, ed);
  },
  lookImg: function (e, imgArr, ed){
    var index = e.currentTarget.dataset.index;
    var url = 'http://img-test.duorang.com/upload/adv/2019/9/2/254db73b-ba6f-43d2-a956-2c1a577e306b.jpg';
    var arrs = [
      'http://img-test.duorang.com/upload/adv/2019/9/4/d54db5df-5a2f-4d1b-b335-cd32501aa3ae.jpg',
      'http://img-test.duorang.com/upload/adv/2019/9/4/ff8b5226-7518-440f-965a-0af94ff063d2.jpg',
      'http://img-test.duorang.com/upload/adv/2019/9/4/77bcd4a9-c5db-47b9-89df-0bf7f6153acc.jpg',
      'http://img-test.duorang.com/upload/adv/2019/9/4/780a63e5-451d-4ac8-82ea-ae97de4178fb.jpg',
      'http://img-test.duorang.com/upload/adv/2019/9/4/41e39497-70f1-404f-8272-f5501efd15d3.jpg',
      'http://img-test.duorang.com/upload/adv/2019/9/4/e45a4f37-cf5b-496c-ae84-024b3e938948.jpg',
      'http://img-test.duorang.com/upload/adv/2019/9/4/163567ee-7b79-4f48-bf92-7ecfea725a67.jpg',
      'http://img-test.duorang.com/upload/adv/2019/9/4/806928ca-ecd2-4595-aeef-440adc7c1584.jpg',
      'http://img-test.duorang.com/upload/adv/2019/9/4/77701b11-c76e-43dc-9e1f-5f6a52663b53.jpg',
      'http://img-test.duorang.com/upload/adv/2019/9/4/89e738ce-d847-4b60-a27f-01c98784e98f.jpg',
      'http://img-test.duorang.com/upload/adv/2019/9/4/eaf046fe-9fa0-428d-b286-3802a632c40c.jpg',
      'http://img-test.duorang.com/upload/adv/2019/9/4/2924c6d0-8e4a-480e-b4d1-f3eafecbea9f.jpg',
      'http://img-test.duorang.com/upload/adv/2019/9/4/8471cd6d-588c-47de-8655-6f745d8708a8.jpg',
      'http://img-test.duorang.com/upload/adv/2019/9/4/7ca5354b-c016-47bc-aa4b-15ee298ac20f.jpg'
    ]
    wx.previewImage({
      current: imgArr[index], 
      urls: ed == 1 ? imgArr.concat(arrs):imgArr.concat(url)
    })
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let loginStatus = wx.getStorageSync('loginStatus');//是否有授权后的名字

    //没有名字弹出 授权弹框
    if (loginStatus) {
      this.setData({
        loginStatus: loginStatus
      })
    }
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
      title: '安居佳全屋定制',
      url: "pages/anjujia/anjujia?shareType=1",
    }
    return _base.shareData(obj);
  }
})