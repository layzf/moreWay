import {
  Base
} from '../../../../utils/base.js';
import {
  Api
} from '../../../../utils/api.js';
var util = require("../../../../utils/util.js")
var _base = new Base();
var _api = new Api();

var total_micro_second = "";

/* 毫秒级倒计时 */
function count_down(that) {
  // 渲染倒计时时钟
  that.setData({
    clock: date_format(total_micro_second)
  });
  if (total_micro_second <= 0) {
    that.setData({
      clock: "已经截止"
    });
    // timeout则跳出递归
    return;
  }
  setTimeout(function() {
    // 放在最后--
    total_micro_second -= 10;
    count_down(that);
  }, 10)
}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = fill_zero_prefix(Math.floor(second / 3600));
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60)); // equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

  return hr + "：" + min + "：" + sec;
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}

Page({
  data: {
    clock: '',
    tabsData: {},
    id: "",
    showShareModal: false,
    drawImage: false,
    proName:'',
    user_code:'',
    business_shop_id:'',
    newList:[]
  },

  onLoad: function(options) {
    wx.hideShareMenu();
    count_down(this);
    console.log(options,"status");
    let tabsData = {};
    tabsData.status = options.status;
    let id = options.id;
    _api.deposit_detail(id, (res) => {
      console.log(res,"user_code");
      let create_at = res.data.create_at;
      let now = new Date();
      let time = util.parseTime(create_at) - now;
      total_micro_second = time + 2 * 60 * 60 * 1000;
      tabsData.total_micro_second = total_micro_second
      console.log('时间',time);
      // tabsData.village_name=res.data.userReceiveInfoDTO.villageInfoDTO.village_name;
      tabsData.village_name = res.data.userReceiveInfoDTO.village_name;
      tabsData.door_number = res.data.userReceiveInfoDTO.door_number;
      tabsData.address_detail = res.data.userReceiveInfoDTO.villageInfoDTO.address_detail;
      tabsData.link_name = res.data.userLinkDTO.link_name;
      tabsData.link_mobile = res.data.userLinkDTO.link_mobile;
      tabsData.so_number = res.data.so_number;
      tabsData.img_url = res.data.projectInfoDTO.img_url;
      tabsData.project_name = res.data.projectInfoDTO.project_name;
      tabsData.project_content = res.data.projectInfoDTO.project_content;
      tabsData.user_name = res.data.userInfoDTO.user_name;
      tabsData.mobiles = res.data.userInfoDTO.mobile;
      tabsData.create_at = res.data.create_at;
      tabsData.pay_at = res.data.pay_at;
      tabsData.pay_price = res.data.pay_price;
      tabsData.end_at = res.data.end_at;
      tabsData.soCancel = res.data.soCancel;
      tabsData.soItemList = res.data.soItemList;
      tabsData.status = res.data.status;
      tabsData.update_at = res.data.update_at;
      tabsData.id = res.data.id;
      tabsData.total_price = res.data.total_price;
      tabsData.dataReserve1 = res.dataReserve1;
      this.setData({
        business_shop_id: res.data.business_shop_id,
        tabsData: tabsData,
        options: options,
        proName:res.data.projectInfoDTO.project_name,
        user_code:res.data.user_code
      })
      console.log(this.data.business_shop_id,"business_shop_idbusiness_shop_id")
    });
  },
  showConfirm(id) {
    let that = this;
    let tab = this.data.tabsData;
    wx.showModal({
      title: "",
      content:"取消订金单将会错失大好的省钱机会， 你要取消吗？",
      showCancel: true,
      cancelText: '仍要取消',
      cancelColor: '#999999',
      confirmText: '不要',
      confirmColor: '#FF5D22',
      success: function(res) {
        if (res.cancel) {
          _api.cancel_order(id, (res) => {
            _base.showToast('取消成功', 'success');
            tab.status = -1;
            that.setData({
                tabsData:tab
            })
          });
        }
      }
    })
  },

  onCancelTap(e) {
    let id = e.currentTarget.dataset.id;
    this.showConfirm(id);
  },

  // 联系商家电话事件
  call_mobile() {
    wx.makePhoneCall({
      phoneNumber: this.data.tabsData.dataReserve1 //仅为示例，并非真实的电话号码
    })
  },

  // 支付
  pay() {
    let id = this.data.tabsData.id;
    _api.pay(id, (res) => {
        wx.requestPayment({
            'timeStamp': "" + res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': "prepay_id=" + res.data.prepay_id,
            'signType': res.data.signType,
            'paySign': res.data.paySign,
            'success': function (res) {
                console.log("成功");
                if (res.errMsg == 'requestPayment:ok') {
                    wx.redirectTo({
                        // url: '/pages/my/my-deposit/deposit-pay-res/deposit-pay-res'
                      url: '/pages/earnest/pay-result/result?payorder=1&payid=' + id + ''
                    })
                }
            },
            'fail': function (res) {
            }
        })
    });
  },
  headCode: function() {
    var that = this;
    var soId = this.data.options.id;
    let token = wx.getStorageSync("token");
    let tokenid = wx.getStorageSync("tokenid");
    wx.downloadFile({
      url: _base.baseRequestUrl + 'soInfoQrCode/getQrCode.json?token=' + token + '&tokenid=' + tokenid + '&soId=' + soId,
      success: function(res) {
        console.log(res);
        that.setData({
          code: res.tempFilePath,
          drawImage: true
        })
        console.log('drawImg', that.data.drawImage);
      }
    })
  },
  closeModel: function() {
    this.setData({
      drawImage: false
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
