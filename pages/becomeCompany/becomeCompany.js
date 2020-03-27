import { Base } from '../../utils/base.js';
import { Api } from '../../utils/api.js';
var _base = new Base();
var _api = new Api();
const app = getApp();
Page({
  data: {
    userName:'',
    phone:'',
    applyPlace:'',
    writeRoom:'',
    imgMaterial:'',
    imgIdentity:'',
    applyPlacehead:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  applyPlacehead:function(e){
    this.setData({
      applyPlacehead: e.detail.value
    })
  },
  applyPlace: function (e) {
    this.setData({
      applyPlace: e.detail.value
    })
  },
  delAdress: function (e) {
    this.setData({
      delAdress: e.detail.value
    })
  },
  writeRoom: function (e) {
    this.setData({
      writeRoom: e.detail.value
    })
  },
  formValidateSubmit: function (para) {
    var result = {
      status: false,
      msg: ''
    }
    if (!_base.validate(para.applyPlacehead, 'require')) {
      result.msg = '请填写申请小区';
      return result;
    }
    if (!_base.validate(para.applyPlace, 'require')) {
      result.msg = '请选择楼栋';
      return result;
    }
    if (!_base.validate(para.writeRoom, 'require')) {
      result.msg = '请选择房号';
      return result;
    }
    if (!_base.validate(para.imgMaterial, 'require')) {
      result.msg = '请上传证明材料';
      return result;
    }
    if (!_base.validate(para.imgIdentity, 'require')) {
      result.msg = '请上传身份证';
      return result;
    }
    result.status = true;
    result.msg = '';
    return result;
  },
    //上传材料和身份证
  chooseImage: function (event) {
    let uploadType = _base.getDataSet(event, 'uploadType');
    let reqToken = wx.getStorageSync('token');
    let reqTokenid = wx.getStorageSync('tokenid');
    // console.log(uploadType);
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      success: function (res) {
        let tempFilePath = res.tempFilePaths[0];
        wx.uploadFile({
          url: _base.baseRequestUrl + 'file/upload' + '.json?token=' + reqToken + '&tokenid=' + reqTokenid,
          header: {
            'content-type': 'multipart/form-data'
          },
          name: 'file',
          filePath: tempFilePath,
          success: function (res) {
            console.log(JSON.parse(res.data));
            let imgPath = JSON.parse(res.data).data;
            if (uploadType === 'material') {
              that.setData({
                imgMaterial: imgPath
              })
            } else if (uploadType === 'identity') {
              that.setData({
                imgIdentity: imgPath
              })
            }
          }, fail: function (error) {
            console.log(error);
          }
        })
      }
    })
  },
  onSubmitTap: function () {
    var allRoom;
    let applyPlace = this.data.applyPlace;
    let delAdress = this.data.delAdress;
    let writeRoom = this.data.writeRoom;
    if (delAdress == '') {
      allRoom = applyPlace + '-' + writeRoom;
    } else {
      allRoom = applyPlace + '-' + delAdress + '-' + writeRoom;
    }
    let para = {
      applyPlacehead: this.data.applyPlacehead,
      applyPlace: this.data.applyPlace,
      delAdress: this.data.delAdress,
      writeRoom: this.data.writeRoom,
      allRoom: allRoom,
      imgMaterial: this.data.imgMaterial,
      imgIdentity: this.data.imgIdentity
    }
    console.log(para);
    var validateResult = this.formValidateSubmit(para);
    if (!validateResult.status) {
      _base.showToast(validateResult.msg);
      return false;
    }
    this.doSubmit(para);
  },
  doSubmit:function(para){
    _api.applyCompany(para.applyPlacehead, para.allRoom, para.imgMaterial, para.imgIdentity, (res) => {
      console.log(res);
      _base.showToast('提交成功','success',1000, function () {
        wx.navigateTo({
          url: 'submitResult/submitResult',
        })
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