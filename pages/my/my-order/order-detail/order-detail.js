import { Base } from '../../../../utils/base.js';
import { Api } from '../../../../utils/api.js';
const throttles = require('../../../../utils/throttle.js')
var _base = new Base();
var _api = new Api();
Page({
  data: {
    tabsData:{},
    numbers:'',
    id:null,
    isDrawback:false,//申请退款文字标识
    newList:{},
    loads:false,
    options:{},
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
  onShow:function(){
    this.newLosk()
  },
  newLosk(){
    var options = this.data.options;
    let tabsData = {};
    tabsData.status = options.status;

    tabsData.pay = options.pay;
    tabsData.soType = options.soType;

    _api.order_detail(options.id, (res) => {
      tabsData.village_name = res.data.userReceiveInfoDTO.village_name;
      tabsData.door_number = res.data.userReceiveInfoDTO.door_number;
      tabsData.address_detail = res.data.userReceiveInfoDTO.villageInfoDTO.address_detail;
      tabsData.link_name = res.data.userLinkDTO.link_name;
      tabsData.link_mobile = res.data.userLinkDTO.link_mobile;
      tabsData.so_number = res.data.so_number;
      tabsData.img_url = res.data.projectInfoDTO.img_url;
      tabsData.project_name = res.data.projectInfoDTO.project_name;
      tabsData.prod_price = res.data.prod_price;
      tabsData.create_at = res.data.create_at;
      tabsData.project_content = res.data.projectInfoDTO.project_content;
      tabsData.user_name = res.data.userReceiveInfoDTO.user_name;
      tabsData.pay_at = res.data.pay_at;
      tabsData.pay2_at = res.data.pay2_at;
      tabsData.pay3_at = res.data.pay3_at;
      tabsData.pay_status = options.pay_status || res.data.pay_status;
      tabsData.id = res.data.id;
      tabsData.status = res.data.status;
      tabsData.pay_price = res.data.pay_price;
      tabsData.soItemDetailList = res.data.soItemDetailList;
      tabsData.height = wx.getSystemInfoSync().screenHeight;
      tabsData.prot_name = res.data.projectInfoDTO.project_name;
      tabsData.remark = res.data.projectInfoDTO.remark;
      tabsData.project_type = res.data.projectInfoDTO.project_type; //店铺跳转
      tabsData.project_id = res.data.projectInfoDTO.id;
      tabsData.discounts = res.data.discounts; //优惠金额
      tabsData.freight = res.data.freight; //运费
      tabsData.return_money_status = res.data.return_money_status;
      tabsData.return_money = res.data.return_money;
      console.log('tabsdata', tabsData);

      if (res.data.prod_img) {
        res.data.prod_img = res.data.prod_img.split(';')
      }
      if (res.data.deliver_img) {
        res.data.deliver_img = res.data.deliver_img.split(';')
      }
      res.data.childSoItemList.forEach(val =>{
        val.transformImg = true
      })
      this.setData({
        newList: res.data,
        tabsData: tabsData,
        numbers: res.dataReserve1,
        id: options.id,
        loads: true,
      })
    });
  },
  lookImgs:function(e){
    var index = e.currentTarget.dataset.index;
    var items = e.currentTarget.dataset.item;
    console.log(items,"asdasd")
      wx.previewImage({
        current: items[index],
        urls: items
      })
  },
  //单查子订单详情
  lookDetail(e){
    var item = e.currentTarget.dataset.item;
    var option = this.data.options;

    var url = `../order-detail/order-detail?id=${item.id}&status=${option.status}&pay=${option.pay_status}&soType=${option.so_type}`;
    wx.navigateTo({
      url: url,
    })
  },
  // 联系商家电话事件
  call_mobile() {
    var numbers = this.data.numbers;
    console.log(numbers);
    wx.makePhoneCall({
      phoneNumber: numbers //仅为示例，并非真实的电话号码
    })
  },
  //
  //取消申请
  cancelBack(e) {
    let id = e.currentTarget.dataset.id;
    let secured_trans = this.data.newList.secured_trans;
    var type = false;
    let data = {
      id: id,
      type: type
    }
    wx.showModal({
      content: '确定取消申请？',
      success: res => {
        if (res.confirm) {
          if (secured_trans == 1 || !secured_trans) {
            data.type = true
          }

          _api.cancelRefundSecuredSoItem(data, res => {
            if (res.resultCode==1000){
              this.newLosk()
            }
          })

        }
      }
    })
  },
  develop(e){
    let index = e.currentTarget.dataset.index;
    var idx = `newList.childSoItemList[${index}].transformImg`;

    this.setData({
      [idx]: !this.data.newList.childSoItemList[index].transformImg
    })

  },
  //申请退款
  drawback: function (e) {
    let back = e.currentTarget.dataset.id;
    let secured_trans = this.data.newList.secured_trans;
    let data={}
/**
 * secured_trans==1 非担保
 * secured_trans==2 担保
 */
    wx.showModal({
      content: '确定是否退款？',
      success: res => {
        if (res.confirm) {
          if (secured_trans == 1 || !secured_trans) { //非担保退款
            data = {
              type: false,
              item: {
                soItemId: back
              }
            }
          } else {  ////担保退款
            data = {
              type: true,
              item: {
                id: back
              }
            }
          }
          _api.refundOrder(data, res => {
            if (res.resultCode == 1000) {
              this.setData({
                isDrawback: true
              })
              wx.showToast({
                title: '申请成功',
              });
            }
          })
        }
          
        }
    })

  },

    //申请返现
    record(e) {
        let id = e.currentTarget.dataset.id;
        wx.redirectTo({
            url: '../../../applyCash/cash?id='+id
        })
    },
    //查看返现
    returnMoneyView(e) {
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../../../cashprogress/cash?id=' + id
      })
    },
    showevalute(e){
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/showEvalute/show?id=" + id
        })
    },
 
    cancel(e){
      let id = e.currentTarget.dataset.id;
      let tabs = this.data.tabsData;
      let that = this;
        wx.showModal({
            title: "取消订单",
            content: "不考虑一下吗?",
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#FF5D22',
            confirmText: '确定',
            confirmColor: '#999999',
            success: function (res) {
                if (res.confirm) {
                    let data = {
                        soItemId:id
                    }
                    _api.cancelOrder(data,res=>{
                        tabs.status = -1;
                        tabs.pay = 1;
                        that.setData({
                            tabsData:tabs
                        })
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            },
            fail:function (res) {
                console.log('取消')
            }
        })
    },

  pay: throttles.throttle(function (e) {
    let id = e.currentTarget.dataset.id;

    var that = this;
    // resp.secured_trans == 2 担保交易 支付
    if (this.data.newList.secured_trans == 2) {
      _api.paySecuredSoItem(id, res => {
        var obj = {
          data: res
        }
        this.requestPayment(obj)
      })
    } else {
      _api.pay_data(id, res => {
        this.requestPayment(res)
      })
    }
  }, 1000),
  //微信支付
  requestPayment(res){
    var that = this;
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
            url: '/pages/earnest/pay-result/result?payorder=1&payid=' + that.data.id + ''
          })
        }
      },
      'fail': function (res) {
      }
    })
  },
 

  shoopUrl:function(){
    console.log("shoopUrl",this.data.tabsData)
    var tabsData = this.data.tabsData;
    var url = ''
    if (tabsData.project_type === 1) {
      url = '../../../onlineOrder/online?id=' + tabsData.project_id;
    } else {
      if (tabsData.status === 2) {
        url = '../../../collect3/collect?id=' + tabsData.project_id;
      } else {
        url = '../../../collect2/collect?id=' + tabsData.project_id;
      }
    }
    console.log(url,"url")
    wx.navigateTo({
      url: url,
    })

  },

  submit(e){
      let status = e.currentTarget.dataset.status;
      let id = e.currentTarget.dataset.id;
      let secured = this.data.newList.secured;
    if (status == 1 || status == 0){
          wx.showModal({
            title: "",
            content: "确定验收?",
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#999999',
            confirmText: '确定',
            confirmColor: '#FF5D22',
              success: function (res) {
                  console.log(res);
                if (res.confirm==true){
                    //secured 1:非担保验收 2:担保验收
                    var data = {
                      type: secured == 1 ? false : true,
                      id: id
                    }
                    _api.sure_check(data, (res) => {
                      if(res.resultCode === 1001){
                        return
                      }
                          _base.showToast('验收成功', 'success',1000,function(){
                              wx.navigateTo({
                                  url: "/pages/my/my-order/order-list/order-list?status=2"+'&groupId=' + id + '&type=' + 2
                              })
                          });

                      });
                  }
              }
          })
      }

      if (status == 2) {
          // wx.navigateTo({
          //   url: "/pages/evalute/evalute/group-comment-view/group-comment-view?id=" + id
          // })
          wx.navigateTo({
              url: "/pages/evalute/evalute?soItemId=" + id
          })
      }
  },


})
