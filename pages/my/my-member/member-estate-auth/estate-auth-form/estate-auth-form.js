import {
  Base
} from '../../../../../utils/base.js';
import {
  Api
} from '../../../../../utils/api.js';
var _base = new Base();
var _api = new Api();
const app = getApp();



Page({
  data: {
    estateInitValue: '',
    selectedEstate: '',
    selectedBuilding: '',
    estateList:[],//获取地址
    searchEstateList: [],//搜索后的地址
    keyName:null,//搜索关键词
    inputValue: '', //点击结果项之后替换到文本框的值
    village_id: '',//点击结果项之后地址id
    prefix:"",//没有选项的值
    hideScroll: true,//搜索遮罩
    buildingData: '',
    applyPlace: '',
    delAdress: '',
    writeRoom: '',
    buildingArr: [],
    imgMaterial: '',
    imgIdentity: '',
  },

  onLoad: function(options) {
    console.log(options);
    this.setData({
      options: options
    })
  },

  //触发bindinput事件
  bindinput: function (e) {
    //用户实时输入值
    var prefix = e.detail.value;
    this.setData({
      prefix: prefix
    })
    //匹配的结果
    var newSource = []
    if (prefix != "") {
      this.data.estateList.forEach(function (e) {
        //输入的字符串如果在数组中某个元素中出现，将该元素存到newSource中
        if (e.village_name.indexOf(prefix) != -1) {
          newSource.push(e)
        }
      })
    };
    // 如果匹配结果存在，那么将其返回，相反则返回空数组
    if (newSource.length != 0) {
      this.setData({
        // 匹配结果存在
        hideScroll: false,
        searchEstateList: newSource
      })
      console.log(this.data.searchEstateList, "十五");
    } else {
      this.setData({
        // 匹配无结果
        hideScroll: true,
        searchEstateList: []
      })
    }
  },

  // 点击获取地址
  itemtap: function (e) {
    console.log(e)
    this.setData({
      inputValue: e.currentTarget.dataset.name,
      prefix: e.currentTarget.dataset.name,
      village_id: e.currentTarget.dataset.id,
      hideScroll: true,
      searchEstateList: []
    })
  },


  onShow: function() {
    _api.getHisvillage((res) => {
      console.log(res,"ss");
      var selectedEstate;
      if (this.data.options.village_name == "undefined") {
        var village_name = wx.getStorageSync("village_name");
        var village_id = wx.getStorageSync("village_id");
        selectedEstate = {
          id: village_id,
          village_name: village_name
        };
      } else {
        selectedEstate = {
          id: this.data.options.village_id,
          village_name: this.data.options.village_name
        };
      }
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
  applyPlace: function(e) {
    this.setData({
      applyPlace: e.detail.value
    })
  },
  delAdress: function(e) {
    this.setData({
      delAdress: e.detail.value
    })
  },
  writeRoom: function(e) {
    this.setData({
      writeRoom: e.detail.value
    })
  },
  formValidateSubmit: function(para) {
    var result = {
      status: false,
      msg: ''
    }
    if (!_base.validate(para.selectedEstate || para.inputValue, 'require')) {
      result.msg = '请选择小区';
      return result;
    }
    if (!_base.validate(para.applyPlace, 'require')) {
      result.msg = '请选择楼栋号';
      return result;
    }
    if (!_base.validate(para.writeRoom, 'require')) {
      result.msg = '请选择楼房号';
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

  onSubmitTap: function() {
    /**
     *  1.如果输入小区没有对应匹配则输入的值，id为0；
     *  2.如果输入小区有对应匹配并且点击则小区地址id，输入值为空；
     *  3.如果选择小区后又修改了内容，则取修改后的值，id为0
     */
    var villageName = '';
    var villageid='';
    if (this.data.prefix == this.data.inputValue){
         villageName = this.data.prefix
         villageid = this.data.village_id
    }else{
      villageName = this.data.prefix
      villageid=0
    }
    var address = villageid ? '' : villageName  //地址
   /**end**/
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
      inputValue: address,
      selectedEstate: villageid,
      applyPlace: this.data.applyPlace,
      delAdress: this.data.delAdress,
      writeRoom: this.data.writeRoom,
      allRoom: allRoom,
      imgMaterial: this.data.imgMaterial,
      imgIdentity: this.data.imgIdentity
    };
 
    var validateResult = this.formValidateSubmit(para);
    if (!validateResult.status) {
      _base.showToast(validateResult.msg);
      return false;
    }
    this.doSubmit(para);
  },

  doSubmit: function(para) {
    _api.uploadMemberInfo(para.inputValue,para.selectedEstate, para.allRoom, para.imgMaterial, para.imgIdentity, (res) => {
      console.log(res);
      _base.showToast('提交成功');
      wx.removeStorageSync('village_name');
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/my/my-member/member-estate-auth/auth-form-res/auth-form-res?commitSuccess=1'
        })
      }, 500);
    });
  },

  chooseImage: function(event) {
    let uploadType = _base.getDataSet(event, 'uploadType');
    console.log(uploadType,"uploadType")
    console.log(event,"event")
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], //original 原图 compressed 压缩图
      success: function(res) {
        let tempFilePath = res.tempFilePaths[0];

        // 上传之前先进行图片压缩
        // wx.compressImage({
        //   src: tempFilePath, // 图片路径
        //   quality: 80, // 压缩质量
        //   success: function(res){
        //     console.log(res)
        //   }
        // })
        wx.uploadFile({
          url: _base.baseRequestUrl + 'file/upload' + '.json',
          header: {
            'content-type': 'multipart/form-data'
          },
          name: 'file',
          filePath: tempFilePath,
          success: function(res) {
            if (JSON.parse(res.data).resultCode == 1000) {
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
            } else {
              _base.showToast('图片上传失败', 'none', 1000);
            }
          },
          fail: function(error) {
            console.log(error);
          }
        })
      }
    })
  },

  bindBuildingPickerChange: function(event) {
    let index = event.detail.value;
    let selectedBuilding = this.data.buildingArr[index];
    console.log(selectedBuilding);
    this.setData({
      selectedBuilding
    })
  },

  bindEstatePickerChange: function(event) {
    let index = event.detail.value;
    let selectedEstate = this.data.estateList[index];
    console.log(selectedEstate);
    this.setData({
      selectedEstate: selectedEstate
    })
    // this.getBuilding(selectedEstate.id);
  },

  getEstates: function() {
    let status = 1,
      page = '',
      pagesize = '';
    _api.getAll(status, page, pagesize, (res) => {
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

  getBuilding: function(village_id) {
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})