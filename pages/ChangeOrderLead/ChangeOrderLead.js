// pages/ChangeOrderLead/ChangeOrderLead.js

import {
  Api
} from '../../utils/api.js';
import {
  Base
} from '../../utils/base.js';

var _api = new Api();
var _base = new Base();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:'',
    oldHeight:'',
    imgHeight:'',
    showpost:false,
    porductTitle:'卓高帝斯固美缝',
    phone:'',
    wechat:'',
    address:'无地址，直接联系商家上门',
    data:[],
    project_name:'',//项目名称
    user_code:'',//转单码
    wechat_code:'',
    wechatText:'识别二维码加商家微信'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,"asdaa")
    this.setData({
      project_name: options.project_name
    })
 //详情   
    _api.businessInfo(options.shoopid, (res) => {
      this.setData({
        data:res,
        porductTitle: res.shop_name,
        phone: res.phone,
        wechat: res.wechat_id,
        wechat_code: res.wechat_code
      })
    

    })
  //转单码
      let soId = options.leadId;
      let token = wx.getStorageSync("token");
      let tokenid = wx.getStorageSync("tokenid");
      wx.downloadFile({
        url: _base.baseRequestUrl + 'soInfoQrCode/getQrCode.json?token=' + token + '&tokenid=' + tokenid + '&soId=' + soId,
        success: res=> {
          this.setData({
            code: res.tempFilePath,
            user_code: options.user_code
          })
        }
      })
  },
  lookMap:function(e){
    console.log(e)
    var index = e.currentTarget.dataset.index;
    let dataList = this.data.data.businessShopAddressDTOList;

    wx.openLocation({
      latitude: +dataList[index].latitude,
      longitude: +dataList[index].longitude,
      scale: 18,
      name: dataList[index].name,
      address: dataList[index].address
    })

  },
  //拨打电话
  callPhone:function(){
      wx.makePhoneCall({
        phoneNumber: this.data.data.phone,
      })
  },
  //复制微信
  copy:function(e){
    var item = e.currentTarget.dataset.wechat;
      wx.setClipboardData({
        data: item,
        success: function (res) {
          wx.showToast({
            title: '复制成功',
          });
        }
    })
  },
  setCard:function(e){
  var that = this;
    var porductTitle = this.data.porductTitle;
    var phone = this.data.phone;
    var wechat = this.data.wechat;
    var address = this.data.data.businessShopAddressDTOList;
    var principal = this.data.principal;
    var wechat_code = this.data.wechat_code;
    console.log(wechat_code, wechat,"wechat_code")

    if (wechat_code && wechat){
      wx.downloadFile({
        url: wechat_code,
        success: function (res) {
          wx.hideLoading();
          if (res.statusCode === 200) {
            var productSrc = res.tempFilePath;
            that.sharePosteCanvas(porductTitle, phone, wechat, address, principal, productSrc)
          } else {
            console.log("ahha ")
            wx.showToast({
              title: '产品图片下载失败！',
              icon: 'none',
              duration: 2000,
              success: function () {
                var productSrc = "";
                that.sharePosteCanvas(porductTitle, phone, wechat, address, principal, productSrc)
              }
            })
          }
        }
      })
      
    }else{
      var productSrc = "";
      that.sharePosteCanvas(porductTitle, phone, wechat, address, principal, productSrc)
    }
      
    
    
  },
  
  sharePosteCanvas: function (porductTitle, phone, wechat, address, principal, wechat_code) {
    console.log("ahahah")
    var that = this;
    that.setData({
      showpost: true
    })

    wx.showLoading({
      title: '加载中',
      mask: true,
    })
  
    const ctx = wx.createCanvasContext('myCanvas', that);
    var width = "";
    const query = wx.createSelectorQuery().in(this);
    query.select('#canvas-container').boundingClientRect(function (rect) {
      
      var height = rect.height;
      var right = rect.right;
      width = rect.width;
      var left = rect.left;

      ctx.setFillStyle('#fff');
      ctx.fillRect(0, 0, rect.width, height);

      ctx.rect(0, 0, rect.width-1, rect.height);
      ctx.setStrokeStyle('#FF3366');
      ctx.stroke();

      that.setData({
        imgHeight: height+20,
        oldHeight: height
      })
 //商家名字     
      if(porductTitle){
        ctx.drawImage("../../images/shoopActive.png", 18, 20, 20, 18);
        ctx.setFontSize(16);
        ctx.setFillStyle('#000');
        ctx.setTextAlign('left');
        ctx.fillText(porductTitle, 48, 35);
//边框
        ctx.setStrokeStyle('#efefef');
        ctx.beginPath();//开始一个新的路径
        ctx.setLineWidth(0.5)
        ctx.moveTo(0, 50);//路径的起点
        ctx.lineTo(rect.width - 1, 50);//路径的终点
        ctx.stroke();//对当前路径进行描边
      }
 //手机号     
      if (phone){
        ctx.drawImage("../../images/phoneActive.png", 18, 70, 14, 14);
        ctx.setFontSize(13);
        ctx.setFillStyle('#B9B9B9');
        ctx.setTextAlign('left');
        ctx.fillText(phone, 43, 84);
      }
  //微信
      if (wechat){
        ctx.drawImage("../../images/wxActive.png", 18, 100, 15, 13);
        ctx.setFontSize(13);
        ctx.setFillStyle('#B9B9B9');
        ctx.setTextAlign('left');
        ctx.fillText(wechat, 43, 115);
      }
//地址      
      if (address){
        var addressArr = address
        ctx.drawImage("../../images/addressActive.png", 18, 130, 13, 15);
        ctx.setFontSize(13);
        ctx.setFillStyle('#B9B9B9');
        ctx.setTextAlign('left');
        var name='';
        for (var item of addressArr){
          name += item.name + item.address+';'
        }

        const CONTENT_ROW_LENGTH = 32; // 正文 单行显示字符长度
        let [contentLeng, contentArray, contentRows] = that.textByteLength(name, CONTENT_ROW_LENGTH);
        ctx.setTextAlign('left');
        ctx.setFillStyle('#B9B9B9');
        ctx.setFontSize(13);
        let contentHh = 20 * 1;
        for (let m = 0; m < contentArray.length; m++) {
          console.log(m)
          if (m >= 1) {
            ctx.fillText(contentArray[m], 43, contentHh * m + 145,160);
            that.setData({
              imgHeight: height + 36
            })
          } else {
            ctx.fillText(contentArray[m], 43, contentHh * m + 145, 160);
          }
        }

        
      }
   

      if (wechat_code) {
        wx.getImageInfo({
          src: wechat_code,
          success: res => {
            console.log("res", res.path)
            ctx.drawImage(res.path, width *0.73, 80, width * 0.21, width * 0.21);

            ctx.setFontSize(10);
            ctx.setFillStyle('#A8A8A8');
            ctx.setTextAlign('left');
            ctx.fillText(that.data.wechatText, width * 0.73-15, 175);

          }
        })
      }

      ctx.drawImage("../../images/bannerBottom.png", 0, that.data.imgHeight - 50, width, 60);
      ctx.save()
    }).exec()
    setTimeout(function () {
      ctx.draw();
      wx.hideLoading();
    }, 1000)

  },
  //计算图片尺寸
  calculateImg: function (src, cb) {
    var that = this;
    wx.getImageInfo({
      src: src,
      success(res) {
        wx.getSystemInfo({
          success(res2) {
            var ratio = res.width / res.height;
            var imgHeight = (res2.windowWidth * 0.65 / ratio) + 130;
            that.setData({
              imgHeight: imgHeight
            })
            cb(imgHeight - 130);
          }
        })
      }
    })
  },
  //点击保存到相册
  setCanvas: function () {
    var that = this;
    wx.showLoading({
      title: '正在保存',
      mask: true,
    })
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function (res) {
          wx.hideLoading();
          var tempFilePath = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success: function () {
              wx.showModal({
                title: '保存图片成功',
                content: '已经保存到相册，您可以手动分享到朋友圈！',
                showCancel: false,
                success: res => {
                  that.closePoste()
                }
              });
            },
            fail: function (res) {
              console.log(res);
              if (res.errMsg == "saveImageToPhotosAlbum:fail cancel") {
                wx.showModal({
                  title: '保存图片失败',
                  content: '您已取消保存图片到相册！',
                  showCancel: false
                });
              } else {
                wx.showModal({
                  title: '提示',
                  content: '保存图片失败，您可以点击确定设置获取相册权限后再尝试保存！',
                  complete: function (res) {
                    console.log(res);
                    if (res.confirm) {
                      wx.openSetting({})      //打开小程序设置页面，可以设置权限
                    } else {
                      wx.showModal({
                        title: '保存图片失败',
                        content: '您已取消保存图片到相册！',
                        showCancel: false
                      });
                    }
                  }
                });
              }
            }
          })
        },
        fail: function (err) {
          console.log(err)
        }
      }, that);
    }, 1000);
  },
// text为传入的文本  num为单行显示的字节长度
  textByteLength(text, num) { 
    let strLength = 0; // text byte length
    let rows = 1;
    let str = 0;
    let arr = [];
    for (let j = 0; j < text.length; j++) {
      console.log(j,"aaa")
      if (text.charCodeAt(j) > 225) {
        strLength += 2;
        if (strLength > rows * num) {
          strLength++;
          arr.push(text.slice(str, j));
          str = j;
          rows++;
        }
      } else {
        strLength++;
        if (strLength > rows * num) {
          arr.push(text.slice(str, j));
          str = j;
          rows++;
        }
      }
    }
    arr.push(text.slice(str, text.length));
    return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
  },
  //关闭海报
  closePoste: function () {
    this.setData({
      showpost: false,
      imgHeight: this.data.oldHeight
    })
  },
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