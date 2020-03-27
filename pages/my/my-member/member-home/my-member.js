import { Base } from '../../../../utils/base.js';
import { Api } from '../../../../utils/api.js';
var _base = new Base();
var _api = new Api();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    villageContentVip:'',
    villageContent:'',
    villageApply:'',
    userName:'',
    loginUser:'',
    user_img: "",
    uploadImg:false,
    villageInfo: "",
    alreadyTime:'',
    mallTime:false,
    uploadImgs:'',
    options:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      options: options
    })
  },
  onChangeAvatar: function (event) {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: _base.baseRequestUrl + 'file/upload' + '.json',
          name: 'file',
          filePath: tempFilePaths[0],
          success: function (res) {
            let user_img = JSON.parse(res.data).data
            console.log(user_img);
            _this.update_icon(user_img);
          }, fail: function (error) {
            console.log(error);
          }
        })
      }
    })
  },
  update_icon(user_img) {
    _api.uploadCode(user_img, (res) => {
      this.setData({
        user_img: user_img,
        uploadImg: true
      })
    })
  },
  applySuccess:function(){
    _api.activationCode((res)=>{
      if (res.resultCode==1000){
        wx.redirectTo({
          url: 'my-member',
        })
      }
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
    _api.diffState((res) => {
      console.log(res);
      var obj = res.data.userInfo;
      var loginUsers = obj.mobile.substr(0, 3) + "****" + obj.mobile.substr(7);
      this.setData({
        villageContentVip: res.data.userInfo,
        villageApply: res.data.userInfo.villageApply,
        villageInfo: res.data.userInfo.villageInfo,
        loginUser: obj.icon,
        userName: loginUsers
      });
      if (res.data.userInfo.villageInfo.img_url) {

      } else {
        res.data.userInfo.villageInfo.img_url = '/images/defalute.jpg';
      }
      
      if (obj.villageApply != null) {
        
        /*this.setData({
          villageContentVip: res.data.userInfo,
          villageApply: res.data.userInfo.villageApply,
          villageInfo: res.data.userInfo.villageInfo,
          loginUser: obj.icon,
          userName: loginUsers
        });
        */
       
        if (obj.villageApply.status==1){
          _api.getCommanders((res) => {
            console.log(res);
            if (res[0].user_img == undefined) {
              this.setData({
                uploadImgs: false
              });
            } else {
              this.setData({
                uploadImgs: true
              });
            }
          });
        }
      } else if (obj.userAut!=null){
        this.setData({
          villageContent: res.data.userInfo.userAut,
          villageContentVip: res.data.userInfo,
          villageInfo: res.data.userInfo.villageInfo,
          loginUser: obj.icon,
          userName: loginUsers,
          id: res.data.userInfo.id,
          village_id: res.data.userInfo.villageInfo.id
        })
        if (obj.userAut.is_activate==1){
          var time3 = res.data.userInfo.userAut.end_at;
          var date = new Date(time3.replace(/-/g, '/'));
          var time2 = date.getTime();
          var timestamp = Date.parse(new Date());
          var alreadyTime = obj.userAut.end_at.substr(0,10);
          this.setData({
            alreadyTime: alreadyTime
          })
          if (timestamp > time2) {
            this.setData({
              mallTime: true
            })
          }
        }
      }
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
    // if (this.data.options.judgeCode==1){
    //   wx.navigateBack({
    //     delta:1
    //   })
    // }else{
      // wx.navigateBack({
      //   delta: 1
      // })
    // }
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