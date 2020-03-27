// pages/r-main/main.js
import {
    Base
} from '../../utils/base.js';
import {
    Api
} from '../../utils/api.js';
import {
    login
} from '../../utils/login.js';
var _login = new login();
var _base = new Base();
var _api = new Api();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:null,
    itemList:[],
    index:0,
    ids:[],
    addressList:[],
    user:{},
    height:0,//高度
    userNamescof:''//授权后的名字
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options刘博文", options)
      let that = this;
      let data = JSON.parse(options.data);
  
      let h = wx.getSystemInfoSync().windowHeight;
      this.setData({
          options:data,
          height:h,
    })

      _api.collectPlist(data.baseId,22,res=>{
        console.log(res,"择业数据")
          let list = res.data.activityInfoList;
          let temp = [];
          for(let o of list){
            temp = temp.concat(o.projects)
          }
        that.setData({
            itemList:temp
        })
      })
  },


    //选中
    checkboxChange(e){
        this.setData({
            ids:e.detail.value
        })
    },
    getData(e){
      let val = e.detail.value;
      let id  = e.target.id;
      let user = this.data.userNamescof
      if(id === 'name'){
        user.user_name = val;
      }else{
        user.mobile = val;
      }
      this.setData({
          user:user
      })
    },

    sumbitData(){
      let user = this.data.userNamescof;
      let option = this.data.options;
      let itemList = this.data.itemList;
      let ids = this.data.ids;
      let id = '';
      for(let o of ids){
        id += o+','
      }
      let data = {
          activity_project_ids:id.substring(0,id.length-1),
          user_name: user.user_name,
          mobile:user.mobile,
          village_full_name:'',
          ridingId:option.ridingId,
          baseId:option.baseId,
          userId:user.id
      }
      if (data.activity_project_ids == "" || !data.activity_project_ids) {
        _base.showToast('请选择集采项目', 'none');
        return
      }
      if (data.user_name == "" || !data.user_name){
        _base.showToast('请获取用户昵称', 'none');
        return
      }
      console.log(data,"data")
      _api.doRSignIn(data,res=>{
          console.log('res',res);
          _base.showToast('签到成功','success');
          setTimeout(()=>{
              wx.reLaunch({
                  url: '/pages/r-success/success?success=true'
              })
          },1000)
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
    let loginUser = wx.getStorageSync('loginUser');

    if (!loginUser.user_name){
      _base.showToast('未授权', 'none', 1200, wx.navigateTo({
        url: '../newLogin/index',
      })) 
    }else{
      this.setData({
        userNamescof: loginUser,
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

  }
})
