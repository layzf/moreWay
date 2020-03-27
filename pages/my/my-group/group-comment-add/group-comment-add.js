import { Base } from '../../../../utils/base.js';
import { Api } from '../../../../utils/api.js';
var _api = new Api();
var _base = new Base();

Page({
  data: {
    groupObj: {},
    select: false,
    imgSrcArr: [],
    imgPathArr: [],
    radioItems: [
      { name: '1', value: '1', checked: 'true', img: 'http://47.92.76.199/group1/M00/00/17/rBoeylrLeXSAePbaAAAK1gIIj08075.png', imgSelected: 'http://47.92.76.199/group1/M00/00/17/rBoeylrLe82AFkr-AAAKB6_eUx0457.png' },
      { name: '2', value: '2', img: 'http://47.92.76.199/group1/M00/00/17/rBoeylrLehmATEIiAAAJm63dO1c759.png', imgSelected: 'http://47.92.76.199/group1/M00/00/17/rBoeylrLfA-AAqkuAAAJDRecRLA588.png' },
      { name: '3', value: '3', img: 'http://47.92.76.199/group1/M00/00/17/rBoeylrLeiqABNUtAAAKw0BHmy0659.png', imgSelected: 'http://47.92.76.199/group1/M00/00/17/rBoeylrLfB-AHDxFAAAJ_pjAGks326.png' }
    ],
    checkboxItems: [
      { name: '0', value: '态度好', checked: false },
      { name: '1', value: '服务热情', checked: false },
      { name: '2', value: '商品质量不错', checked: false },
      { name: '3', value: '期待下次开团', checked: false },
      { name: '4', value: '质量不错', checked: false },
      { name: '5', value: '非常棒', checked: false },
      { name: '6', value: '棒棒哒', checked: false },
      { name: '7', value: '很好很好', checked: false }
    ],
    textArea: '',
    radioValue: 1
  },

  onLoad: function (options) {
    console.log(options);
    this.setData({
      groupObj: options
    });
  },

  textareaInput: function (e) {
    this.setData({
      textArea: e.detail.value
    })
  },

  formValidateSubmit: function (para) {
    var result = {
      status: false,
      msg: ''
    }
    if (!_base.validate(para.textArea, 'require')) {
      result.msg = '请输入评价内容';
      return result;
    }
    result.status = true;
    result.msg = '';
    return result;
  },

  onSubmitTap: function () {
    let that=this;
    let para = {};
    para.textArea = this.data.textArea;
    para.radioValue = this.data.radioValue;
    para.evalute_type = that.data.groupObj.datatype;
    para.ref_id = that.data.groupObj.groupId;
    para.score = that.data.radioValue;
    let label=[];
    console.log(that.data.checkboxItems);
    var validateResult = this.formValidateSubmit(para);
    if (!validateResult.status) {
      _base.showToast(validateResult.msg);
      return false;
    }
    for (var i = 0; i < that.data.checkboxItems.length; i++) {
      if (that.data.checkboxItems[i].checked == true) {
        label.push(that.data.checkboxItems[i].value);
      }
    }
    let label1=label.join(";");
    para.label = label1;
    para.content = that.data.textArea;
    let img_url1=that.data.imgSrcArr.join(";");
    para.img_url = img_url1;
    console.log(para);
    _api.evaluateinfo(para,(res)=>{
      _base.showToast('提交成功', 'success');
        setTimeout(() => {
          wx.navigateBack({
            delta:1
          })
        }, 500);
    })
    // var validateResult = that.formValidateSubmit(para);
    // if (!validateResult.status) {
    //   _base.showToast(validateResult.msg);
    //   return false;
    // }
  
    // setTimeout(() => {
    //   if (this.data.groupObj.pageType == 'order') {
    //     wx.redirectTo({
    //       url: '/pages/my/my-order/order-list/order-list',
    //     })
    //   } else {
    //     wx.redirectTo({
    //       url: '/pages/my/my-group/my-group-list/my-group-list',
    //     })
    //   }
    // }, 500);
  },

  checkboxChange: function (e) {
    let checkboxItems = this.data.checkboxItems;
    let checkArr = e.detail.value;
    // checkboxItems[checkArr].checked = !checkboxItems[checkArr].checked
    for (var i = 0; i < checkboxItems.length; i++) {
      if (checkArr.indexOf(i + '') != -1) {
        checkboxItems[i].checked = true;
      } else {
        checkboxItems[i].checked = false;
      }
    }
    console.log(checkboxItems);
    this.setData({
      checkboxItems: checkboxItems,
    })
  },

  radioChange: function (e) {
     console.log('radio发生change事件，携带value值为：', e.detail.value);
    let radioValue = e.detail.value;
    let radioItems = this.data.radioItems;
    for (let i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      radioItems: radioItems,
      radioValue: radioValue
    });
  },

  chooseImage: function () {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
         console.log(tempFilePaths);
        wx.uploadFile({
          url: _base.baseRequestUrl + 'file/upload' + '.json',
          name: 'file',
          filePath: tempFilePaths[0],
          success: function (res) {
            var obj = JSON.parse(res.data)
            console.log(JSON.parse(res.data));
            var imgSrc = obj.data;
            console.log(imgSrc);
            _this.data.imgSrcArr = _this.data.imgSrcArr.concat(imgSrc);
            console.log(_this.data.imgSrcArr);
            _this.setData({
              imgSrcArr: _this.data.imgSrcArr
            });
          }, fail: function (error) {
            console.log(error);
          }
        })
      }
    })
  },

  onDeleteTap: function (event, index) {
    var index = _base.getDataSet(event, 'index');
    this.data.imgSrcArr.splice(index, 1);
    this.setData({
      imgSrcArr: this.data.imgSrcArr
    });
  },

  previewImage: function (event) {
    wx.previewImage({
      current: _base.getDataSet(event, 'currentSrc'),
      urls: this.data.imgSrcArr
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (this.data.groupObj.pageType == 'order') {
      wx.setNavigationBarTitle({
        title: '订单评价'
      });
    } else {
      wx.setNavigationBarTitle({
        title: '参团评价'
      });
    }
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