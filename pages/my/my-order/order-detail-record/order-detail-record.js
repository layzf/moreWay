import { Base } from '../../../../utils/base.js';
import { Api } from '../../../../utils/api.js';
var _base = new Base();
var _api = new Api();
Page({
  data: {
    modalTap: true,
    animationData: {},
    content:'',
    imgSrcArr: [],
    soItemId:"",
  },

  onLoad: function (options) {
    console.log(options);
    this.setData({
      soItemId: options.soItemId
    });
   
  },

  textareaInput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  formValidateSubmit: function (para) {
    var result = {
      status: false,
      msg: ''
    }
    if (!_base.validate(para.content, 'require')) {
      result.msg = '请输入反馈内容';
      return result;
    }
    result.status = true;
    result.msg = '';
    return result;
  },

  onSubmitTap: function () {
    let that = this;
    let para = {};
    para.soItemId = that.data.soItemId;
    para.label = "";
    para.score = 5;
    para.content = this.data.content;
    let img_url1 = that.data.imgSrcArr.join(";");
    para.img_url = img_url1;
    console.log(para);
    var validateResult = this.formValidateSubmit(para);
    if (!validateResult.status) {
      _base.showToast(validateResult.msg);
      return false;
    }
    _api.problem_feedback(para, (res) => {
      _base.showToast('提交成功', 'success');
      setTimeout(() => {
        this.hideModal();
      }, 500);
    })
  },

  handelModal: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export(),
      modalTap: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },

  hideModal: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        modalTap: false
      })
    }, 200)
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