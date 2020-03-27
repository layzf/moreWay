// pages/sw-count/index.js.
import { Api } from "../../utils/api";
import { Base } from "../../utils/base";


let _base = new Base();
let _api = new Api();

const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',//选择的品牌id
    typeSetp:'',
    categoryId:'',
    shareName:'',
    shareUrl:'',
    date:'',
    int:[
      { text: '输入姓名', name: '1', type: 'text', value:''},
      { text: '输入手机号', name: '2', type: 'number', value:'' },
      { text: '输入小区名称', name: '3', type: 'text', value:''},
      { text: '输入楼栋房号', name: '4', type: 'text', value:''},
      { text: '选择时间', name: '5',value:''},
    ],
    startTime:'',//开始预约时间
    endTime:'',//结束时间
    isShowCoun:'',//是否要显示任务条
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.apointList(options)

    var myDate = new Date();

    var endTime = new Date(myDate);
    endTime.setDate(endTime.getMonth() + 30);

  /**当前时间 */
    var myYear = myDate.getFullYear();  // 获取当前年份

    var myMonth = myDate.getMonth() + 1; // 获取当前月份

    var myDay = myDate.getDate() // 获取当前日（1- 31）

//***结束时间  3个月的 */
    var newDate = myYear + '-' + myMonth + '-' + myDay;  //开始时间

    this.setData({
      startTime: newDate,
      endTime: app.getNextMonth(newDate)
    })

  },


  apointList: function (options){
    var int = this.data.int;

    var name = 'int[0].value';
    var moile = 'int[1].value';
    var villageName = 'int[2].value';
    var buildIng = 'int[3].value';
    var appoinTime = 'int[4].value';
    var changeVillageName = wx.getStorageSync('changeVillageName');
    let userInfo = wx.getStorageSync('loginUser');

    _api.apointList(res=>{
      console.log(res,'adasd')
      if (res){
          this.setData({
            [name]: res.link_name,
          })
        }
      console.log(options,"isShowCoun")
      this.setData({
        [moile]: userInfo.mobile,
        [villageName]: changeVillageName,
        typeSetp: options.typeSetp,
        categoryId: options.categoryId,
        shareName: options.shareName,
        shareUrl: options.shareUrl,
        id: options.id,
        isShowCoun: options.isShowCoun
      })
    })
  },
  //选择时间
  bindDateChange: function (e) {
    var appoinTime = 'int[4].value';

    this.setData({
      [appoinTime]:'',
      date: e.detail.value
    })
  },
  //提交信息
  submit:function(e){
    var val = e.detail.value;
    var arr = [];
    var int = this.data.int;

    for(var i=0;i<int.length;i++){
      arr.push({ val: val['key_' + int[i].name], place: int[i].text})
    }
    this.eslintForm(val, arr)
  },

  eslintForm: function (val, arr){
    var that = this
    var newArr = arr.filter(item => item.val == '')

    if (newArr.length != 0){
      _base.showToast('请' + newArr[0].place, 'none')
    }else{
        var data={
          link_name:val.key_1,
          project_id: this.data.id,
          phone: val.key_2,
          village_name: val.key_3,
          building_no: val.key_4,
          appoint_time: val.key_5,
        }
      _api.addApointRecord(data,res=>{
        console.log(res,'aaa')
        if (res.resultCode===1000){

          wx.showModal({
            title: "提示",
            content: "预约成功等待商家上门量尺",
            showCancel: true,
            cancelText:'查看详情',
            cancelColor:'#E94816',
            confirmText: "返回首页",
            confirmColor: "#E94816",
            success: function (res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '../index/index',
                })
              } else if (res.cancel) {
                wx.navigateTo({
                  url: '../my/my-group/my-group-list/my-group-list?type=1',
                })

              }

            }
          })

        }else if(res.resultCode===1001){
          _base.showToast('系统异常', 'none')
        }
      })
      console.log('全部通过后 提交')
    }
    
  
  },
})