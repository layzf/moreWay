// pages/y-inspectionGroup/y-inspectionGroup.js
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
     date:'',
     user_name:'',
     villageName:'',//小区名字
  },

  onShow: function (options) {
    let userInfo = wx.getStorageSync('loginUser');
    if(!userInfo.user_name){
      _base.showToast('未授权', 'none', 1200, wx.navigateTo({
        url: '../newLogin/index',
      })) 
    }else{
      this.setData({
        user_name: userInfo.user_name
      })
    }
    
  },


//选择交房时间
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  //输入的小区名字
  plVillageName:function(e){
    this.setData({
      villageName: e.detail.value
    })
  },
  //提交表单
  addInt:function(e){
//去授权
    if (!this.data.user_name){
      _base.showToast('未授权', 'none', 1200, wx.navigateTo({
        url: '..//newLogin/index',
      })) 
      return
    }
    var villageName = this.data.villageName;
    var days = this.data.date;
  
    if (villageName==''){
      _base.showToast('请填写小区名称', 'none');
      return
    }
    if (days==''){
      _base.showToast('请填写交房时间', 'none');
      return
    }
    var data = {
      villageName: villageName,
      time: days
    }
    console.log("申请信息",data)

    _api.applyGroup(data, res => {
      console.log(res,)
      if (res.resultCode == 1000){
        _base.showToast('提交成功', 'success');
        setTimeout(()=>{
          wx.navigateTo({
            url: `../y-myorderHouse/y-myorderHouse?current=${0}`,
          })  
        },1000)
      }else{
        _base.showToast('提交失败', 'none');
      }
    })
  },
 
})