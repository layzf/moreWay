// pages/applyCash/cash.js
import {Api} from "../../utils/api";
import {Base} from "../../utils/base";
import {login} from '../../utils/login.js';

let _base = new Base();
let _api = new Api();
let _login = new login();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card:'',
      id:''
  },

  addCard(){
    wx.navigateTo({
      url: '../bankList/list'
    })
  },
  sumbitData(){
    let card = this.data.card;
    let id = this.data.id;
    let data={
        id:id,
        bankId:card.id
    }
    _api.applyMoney(data,res=>{
        console.log('res',res);
        wx.showToast({
            title:'提交申请成功',
            duration:1000,
            success:function(){
                setTimeout(()=>{
                    wx.redirectTo({
                      url: '../cashprogress/cash?id='+id
                    })
                },1000)
            }
        })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let id = options.id;
      let that = this;
      _api.searchPersonBank(res=>{
          console.log('res',res);
          let d = '';
          for(let o of res){
            if(o.isDefault && o.isDefault === 1){
              d = o;
            }
          }
          if(!d){
            d = res[0]
          }
          that.setData({
              card:d,
              id:id
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
    let pages = getCurrentPages();
    let current = pages[pages.length - 1];
    console.log('current',current);
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
