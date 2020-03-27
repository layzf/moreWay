import { Base } from '../../../../utils/base.js';
import { Api } from '../../../../utils/api.js';
var _api = new Api();
var _base = new Base();

Page({
  data: {
    Obj: {},
    select: false,
    imgSrcArr: [],
    imgPathArr: [],
    textArea: '',
    radioValue: 1
  },

  onLoad: function (options) {
    console.log('options',options);
    this.setData({
      Obj: options
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
      result.msg = '请输入申请原因';
      return result;
    }
    result.status = true;
    result.msg = '';
    return result;
  },

  onSubmitTap: function () {
    let that = this;
    let para = {};
    para.textArea = this.data.textArea;
    para.ref_id = that.data.Obj.id;
    var validateResult = this.formValidateSubmit(para);
    if (!validateResult.status) {
      _base.showToast(validateResult.msg);
      return false;
    }
    // let img_url1 = that.data.imgSrcArr.join(";");
    // para.img_url = img_url1;
    // console.log(para);
    _api.sub_record(para, (res) => {
      console.log(res);
      _base.showToast('提交成功', 'success');
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/my/my-deposit/refund-deposit-list/refund-deposit-list?type=2',
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
            console.log("这是图片");
            console.log(JSON.parse(res.data));
            var imgSrc = tempFilePaths[0];
            _this.data.imgSrcArr = _this.data.imgSrcArr.concat(imgSrc);
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
    if (this.data.Obj.page_type == 'deposit') {
      wx.setNavigationBarTitle({
        title: '申请退定金'
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
