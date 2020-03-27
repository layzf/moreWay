import { Base } from '../../../../utils/base.js';
import { Api } from '../../../../utils/api.js';
var _base = new Base();
var _api = new Api();
const app = getApp();
Page({
  data: {
    groups: [{
      name:"和当时",
      phone:132456,
      status:"1",
    }],
    type:'',
   startTime:'',//开始时间
    endTime:'',//结束时间
  },

  onLoad: function (options) {
    wx.hideShareMenu();
    if (options.hasOwnProperty('type')){
      this.setData({
        type:options.type
      })
    }

    var myDate = new Date();

    var myYear = myDate.getFullYear();  // 获取当前年份

    var myMonth = myDate.getMonth() + 1; // 获取当前月份

    var myDay = myDate.getDate() // 获取当前日（1- 31）

    var date = myYear + '-' + myMonth + '-' + myDay;

    
    this.setData({
      startTime: date,
      endTime: app.getNextMonth(date)
    })



  },
//修改预约时间
  bindDateChange: function (e) {

    var id = e.currentTarget.dataset.id;

    var groupList = this.data.groupList;
      
    for (var i = 0; i < groupList.length;i++){
      if (groupList[i].id==id){
        groupList[i].activity_project_enroll_create_at = e.detail.value
      }
    }

    var data = {
      id: id,
      status: false,
      date: e.detail.value
    }
    _api.updateApointRecord(data, res => {
      console.log(res, "预约时间")
      if (res.resultCode===1000){
        _base.showToast('修改成功','none')
      }else{
        _base.showToast('修改失败', 'none')
      }
    })
 
    this.setData({
      groupList: groupList
    })

    

  },
  Cancel:function(e){
    var id = e.currentTarget.dataset.id;
    var data = {
      id: id,
      status: 1
    }
    wx.showModal({
      title: '提示',
      content: '是否取消预约量尺',
      showCancel: true,
      confirmText: "确定",
      confirmColor: "#E94816",
      success: res => {
        if (res.confirm == true) {
          _api.updateApointRecord(data, res => {
             console.log(res,"确定1") 
            this.myApointList()
          })
        } else {
          console.log('取消申请订金');
        }
      }
    })


   
  },
  onCancelTap:function(e){
    var village_activity_id = _base.getDataSet(e,"id");
    _api.calcelSingup(village_activity_id,(res)=>{
      wx.navigateTo({
        url: 'my-group-list',
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
    if(!this.data.type){
      _api.myOfffered((res) => {
        console.log(res);
        var objs = res.data;
        for (var i = 0; i < objs.length; i++) {
          var time2 = app.times(objs[i].beg_at);
          var time4 = app.times(objs[i].end_at);
          objs[i].beg_at = app.timestampToTime(time2);
          objs[i].end_at = app.timestampToTime(time4);
        }
        this.setData({
          groupList: res.data
        })
      })
    }else{
      //我的预约量尺
      wx.setNavigationBarTitle({
        title:'预约量尺'
      })
      this.myApointList()
     
    }
  },
  myApointList:function(){
    _api.myApointList(res => {

      var resp = res

      for (var i = 0; i < resp.length; i++) {
        resp[i].activity_project_enroll_create_at = resp[i].activity_project_enroll_create_at.substr(0, 10)
      }
      this.setData({
        groupList: resp
      })
    })

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