import { Base } from '../../../../utils/base.js';
import { Api } from '../../../../utils/api.js';
const throttles = require('../../../../utils/throttle.js')

var _base = new Base();
var _api = new Api();
Page({
  data: {
    isDrawback:false,
    navScrollLeft:0,
    windowWidth:'',
    productId:'',
    tabsData: {
      tabs: [
        {
          status: '',
          title: '全部'
        },
        {
          status: '1',
            title: '待付款'
        },
        {
          status: '2',
          title: '待验收'
        },
        {
          status: '3',
          title: '待评价'
        },
        {
          status: "4",
          title: '退补款单'
        }

      ],
      currentSelectTab: ""
    },
    listData: [],
  },

  onLoad: function (options) {
    wx.hideShareMenu();
    console.log(options,"options")
    let tabsData = this.data.tabsData;
    tabsData.currentSelectTab = options.type || '';
    
    this.setData({
      tabsData: tabsData,
    });

    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowWidth: res.windowWidth
        })
      },
    })

    if (options.cur){
      var cur = options.cur;
      var singleNavWidth = this.data.windowWidth / 5;
      this.setData({
        navScrollLeft: (cur - 2) * singleNavWidth
      })
    }
  },

  cancel(e){
      let that = this;
      let id = e.currentTarget.dataset.id;
      let index = e.currentTarget.dataset.index;
      let securedId= e.currentTarget.dataset.secured;
      let tabs = this.data.listData;
      let data = {
        id: id,
        securedId: securedId
      }
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
                _api.cancelOrder(data,res=>{
                   that.get_order();
                    wx.showToast({
                      title: '取消成功',
                    });
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
//取消申请
  cancelBack(e){
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let secured_trans = _base.getDataSet(e, 'secured_trans');
    var type = false;
    let data = {
      id: id,
      type: type
    }

    wx.showModal({
      content: '确定取消申请？',
      success: res => {
        if (res.confirm) {
          if (secured_trans == 1 || !secured_trans){
            data.type = true
          }

          _api.cancelRefundSecuredSoItem(data, res => {
            console.log(res, "哈哈哈")
            if (res.resultCode==1000){
              this.get_order();
            }
          })

        }
      }
    })

  },
  //申请退款
  drawback:function(e){
    var that = this;
    let back = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let secured_trans = _base.getDataSet(e, 'secured_trans');
    let data = {}
    wx.showModal({
      content: '确定是否退款？',
      success: res => {
        if (res.confirm) {
          if (secured_trans == 1 || !secured_trans){ //非担保退款
            data={
              type:false,
              item:{
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
                isDrawback: true,
                productId: back
              })
              _base.showToast('申请成功', 'success', 1000, function () {
                that.get_order();
              });
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },
  onConfirmTap: function (event) {
    var that = this;
    let status = _base.getDataSet(event, 'status');
    let prod_img = _base.getDataSet(event, 'prod_img');
    let village_name = _base.getDataSet(event, 'village_name');
    let project_name = _base.getDataSet(event, 'project_name');
    let prod_price = _base.getDataSet(event, 'prod_price');
    let id = _base.getDataSet(event, 'id');
    let returnData = _base.getDataSet(event, 'return');
    let secured_trans = _base.getDataSet(event, 'secured_trans');
    console.log(event);

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
            //secured_trans 1:非担保验收 2:担保验收
            var data={
              type: secured_trans==1? false: true,
              id:id
            }
            _api.sure_check(data, (res) => {
             if(res.resultCode===1001){
               return
             }

              let tabsData = that.data.tabsData;
              tabsData.currentSelectTab = 3;

              that.setData({
                tabsData: tabsData
              });

              _base.showToast('验收成功', 'success', 1000, function () {
                that.get_order();
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
    if(status == 3){
        if(returnData!== 'temp'){
            if(returnData == 0){
                wx.redirectTo({
                    url: '../../../applyCash/cash?id='+id
                })
            }else{
                wx.navigateTo({
                    url: '../../../cashprogress/cash?id=' + id
                })
            }
        }else{
            wx.navigateTo({
                url: "/pages/showEvalute/show?id=" + id
            })
        }
    }
  },

  shoopUrl:function(e){
    console.log(e,"e")
    var listData = this.data.listData[e.currentTarget.dataset.index];
    var url = ''
    if (listData.project_type === 1) {
      url = '../../../onlineOrder/online?id=' + listData.project_id;
    } else {
      if (listData.status === 2) {
        url = '../../../collect3/collect?id=' + listData.project_id;
      } else {
        url = '../../../collect2/collect?id=' + listData.project_id;
      }
    }
    wx.navigateTo({
      url: url,
    })
  },


  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    var singleNavWidth = this.data.windowWidth / 5;
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
  },

  onTabsItemTap: function (event) {
    this.switchNav(event)
    let tabId = _base.getDataSet(event, 'status');
    console.log(tabId,"tabId")
    let tabsData = this.data.tabsData;
    tabsData.currentSelectTab = tabId;
 
    this.setData({
      tabsData: tabsData,
    });
    this.get_order();
  },

  payData: throttles.throttle(function (e) {
    let resp = _base.getDataSet(e, 'status');
    console.log(resp,"resp")
    var listData = this.data.listData;
// resp.secured_trans == 2 担保交易 支付
    if (resp.secured_trans == 2){
      _api.paySecuredSoItem(resp.id, res => {
        var obj = {
          data: res
        }
        this.requestPayment(obj, resp)
      })
    }else{
      _api.pay_data(resp.id, res => {
        this.requestPayment(res, resp)
      })
    }
  },1000),
  //微信支付
  requestPayment(res, resp){
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
          if (resp.secured_trans==2){

            let tabsData = that.data.tabsData;
            tabsData.currentSelectTab = '2';

            that.setData({
              tabsData: tabsData
            });

            that.get_order();
            return
          }
          wx.navigateTo({
            url: '/pages/earnest/pay-result/result?payorder=1&payid=' + resp.id + ''
          })
        }
      },
      'fail': function (res) {
      }
    })
  },
  
  get_order() {
    let para = this.data.tabsData.currentSelectTab;
    console.log('params',para);
    // if(para==6){
    //     _api.get_data(0,res=>{
    //         this.setData({
    //             listData: res
    //         });
    //     })
    //     return;
    // }
    // _api.get_order(para, (res) => {
    //   console.log(res);
    //   this.setData({
    //     listData: res
    //   });
    // });
    var data = {
      typeStatus: para,
      pagesize: 1000// 页大小
    }
    
    _api.get_dataNewList(data,res=>{
      this.setData({
        listData: res
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
    this.get_order();
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
