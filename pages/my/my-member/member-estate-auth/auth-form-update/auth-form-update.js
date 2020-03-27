import { Base } from '../../../../../utils/base.js';
import { Api } from '../../../../../utils/api.js';
var _base = new Base();
var _api = new Api();
const app = getApp();
Page({
  data: {
    estateInitValue: '',
    selectedEstate: '',
    selectedBuilding: '',
    estateList: [],
    buildingData: '',
    applyPlace: '',
    delAdress: '',
    writeRoom: '',
    buildingArr: [],
    imgMaterial: '',
    imgIdentity: '',
    collectDespoit:'',
    collectVillage:'',
    applyPlaces:'',
    delAdresss:'',
    writeRooms:'',
  },

  onLoad: function (options) {

  },

  onShow: function () {
    // 显示会员信息
    _api.diffState((res) => {
      console.log(res);
      var reqInfomation = res.data.userInfo.userAut.door_number.split('-');
      if (reqInfomation.length>2){
        this.setData({
          applyPlaces: reqInfomation[0],
          delAdresss: reqInfomation[1],
          writeRooms: reqInfomation[2]
        })
      }else{
        this.setData({
          applyPlaces: reqInfomation[0],
          writeRooms: reqInfomation[1]
        })
      }
      this.setData({
        collectDespoit: res.data.userInfo.userAut,
        collectVillage: res.data.userInfo.villageInfo
      })
    })
    _api.getHisvillage((res) => {
      console.log(res);
      var village_name = wx.getStorageSync("village_name");
      var village_id = wx.getStorageSync("village_id");
      console.log(village_name);
      let selectedEstate = {
        id: village_id,
        village_name: village_name
      };
      if (this.data.selectedEstate != '') {
        this.setData({
          selectedEstate: this.data.selectedEstate
        })
      } else {
        this.setData({
          selectedEstate: selectedEstate
        })
      }
      console.log(selectedEstate);
      this.getEstates();
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
    console.log(this.data.selectedEstate.id);
    var para;
    if (this.data.selectedEstate.id==undefined){
      para={
        id: this.data.collectDespoit.id,
        selectedEstate: this.data.collectVillage.id,
        allRoom: this.data.collectDespoit.door_number,
        imgMaterial: this.data.imgMaterial,
        imgIdentity: this.data.imgIdentity
      }
    }else{
      para = {
        id: this.data.collectDespoit.id,
        selectedEstate: this.data.selectedEstate.id,
        allRoom: allRoom,
        imgMaterial: this.data.imgMaterial,
        imgIdentity: this.data.imgIdentity
      }
    }
    console.log(para);
    var validateResult = this.formValidateSubmit(para);
    if (!validateResult.status) {
      _base.showToast(validateResult.msg);
      return false;
    }
    this.doSubmit(para);
  },

  doSubmit: function (para) {
    _api.updateVip(para.id,para.selectedEstate, para.allRoom, para.imgMaterial, para.imgIdentity,(res)=>{
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/my/my-member/member-estate-auth/auth-form-res/auth-form-res?commitSuccess=1'
        })
      }, 500);
    })
  },

  chooseImage: function (event) {
    let uploadType = _base.getDataSet(event, 'uploadType');
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      success: function (res) {
        let tempFilePath = res.tempFilePaths[0];
        wx.uploadFile({
          url: _base.baseRequestUrl + 'file/upload' + '.json',
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

  bindBuildingPickerChange: function (event) {
    let index = event.detail.value;
    let selectedBuilding = this.data.buildingArr[index];
    console.log(selectedBuilding);
    this.setData({
      selectedBuilding
    })
  },

  bindEstatePickerChange: function (event) {
    let index = event.detail.value;
    let selectedEstate = this.data.estateList[index];
    console.log(selectedEstate);
    this.setData({
      selectedEstate: selectedEstate
    })
    // this.getBuilding(selectedEstate.id);
  },

  getEstates: function () {
    let status = '', page = '', pagesize = '';
    _api.getAll(status, page, pagesize, (res) => {
      console.log(res);
      this.setData({
        estateList: res.data
      });
      let estateInitId = parseInt(this.data.selectedEstate.id);
      console.log(estateInitId);
      this.setData({
        estateInitValue: res.data.findIndex(ele => ele.id === estateInitId)
      });
    });
  },

  getBuilding: function (village_id) {
    _api.getBuilding(village_id, (res) => {
      console.log(res);
      this.setData({
        buildingArr: res.data
      })
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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