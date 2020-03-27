// pages/bankCard/bankCard.js
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
    user:{
      user_name:'',
      card:''
    }
  },

  getData(e){
    console.log('e',e)
    let val = e.detail.value;
    let id = e.currentTarget.id;
    let user = this.data.user;
    if(id === 'name'){
      user.user_name = val;
    }else{
      user.card = val;
    }
    this.setData({
        user:user
    })
  },

  //提交数据
  sumbitData(){
    let user = this.data.user;
    let msg = '';
    if(!/^([1-9]{1})(\d{18})$/.test(user.card)){
      msg = '卡号不正确';
    }else if(user.user_name === ''){
      msg = '用户名未填写';
    }
    if(msg){
        wx.showToast({
            title:msg,
            duration:1000,
            image:'../../images/jinggao.png'
        });
        return false;
    }
    let d = {
        userName:user.user_name,
        BankCard:user.card
    }
    _api.addPersonBank(d,res=>{
      wx.showToast({
          title:'添加成功',
          duration:1000,
          success(){
            setTimeout(()=>{
                wx.redirectTo({
                    url: '../bankList/list'
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
    wx.hideShareMenu();
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
