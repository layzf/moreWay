import { Base } from '../../../../utils/base.js';
import { Api } from '../../../../utils/api.js';
import { login } from '../../../../utils/login.js';
var _base = new Base();
var _api = new Api();
var _login = new login();

Page({
  data: {
    er_show: false,
    er_model: "",
    tabsData: {
      tabs: [
        {
          status: 9,
          title: '全部'
        },
        {
          status: 0,
          title: '待付款'
        },
        {
          status: 1,
          title: '待转单'
        } ,
        {
          status: 2,
          title: '已转单'
        }
      ],
      currentSelectTab: 9
    },
    listData: [],
    so_id:"",
  },

  onLoad: function (options) {
    wx.hideShareMenu();
    _login.login();
    let tabsData = this.data.tabsData;
    tabsData.currentSelectTab = options.type || 9;
    this.setData({
      tabsData: tabsData
    });
    console.log('tab',this.data.tabsData);
    this.getDeposits();
  },
//去转单页面
  goDetail: function (event){
    let id = _base.getDataSet(event, 'id');
    let status = _base.getDataSet(event, 'status');
    let sotype = _base.getDataSet(event, 'sotype');
    console.log(id, status, sotype)
    
    if (sotype!=3){
      wx.navigateTo({
        url: `../deposit-detail/deposit-detail?id=${id}&status=${status}`,
      })
    }else{
      // _base.showToast()
    }
    
  },
  showConfirm(content, cancelFlag) {
    let that=this;
    wx.showModal({
      title: "",
      content: content || "",
      showCancel: true,
      cancelText: '仍要取消',
      cancelColor: '#999999',
      confirmText: '不要',
      confirmColor: '#FF5D22',
      success: function (res) {
        if (res.cancel && cancelFlag) {
          _api.cancel_order(that.data.so_id, (res) => {
            _base.showToast('取消成功', 'success',3000,function(){
              wx.redirectTo({
                url: 'deposit-list',
              })
            });
          });

        }
      }
    })
  },

  onCancelTap(event) {
    let so_id = _base.getDataSet(event, 'id');
    console.log("这是so_id");
    console.log(so_id);
    this.setData({
      so_id: so_id
    });
    this.showConfirm('取消订金单将会错失大好的省钱机会， 你要取消吗？', true);
  },
  message:function(){
    _base.showAlert('有效期内集采价只能降不能加，超过订金有效期，商家有权不转单或者涨价转单。例外情况：如果遇到品牌厂家总部实施全国统一涨价，保价自动失效。')
    
  },
  onTabsItemTap: function (event) {
    console.log(event);
    let tabId = _base.getDataSet(event, 'status');
    let tabsData = this.data.tabsData;
    tabsData.currentSelectTab = tabId;
    console.log(tabsData.currentSelectTab);
    this.setData({
      tabsData: tabsData
    });
    this.getDeposits();
  },

  getDeposits() {
    let that = this;
    let para = this.data.tabsData.currentSelectTab;
    _api.getDeposits(para, {}, (res) => {
      console.log('deposit',res);
      let now = new Date().getTime()/1000;
      res.forEach((ele) => {
        ele.page_type = 'order';
        ele.statuss = ele.status;
        ele.status = _base.changState(ele.status);
        ele.pay_at =  ele.pay_at?that.changeDate(ele.pay_at):that.changeDate(ele.create_at);
        ele.end_at = ele.end_at?that.changeDate(ele.end_at):that.changeDate(ele.update_at);
      });
      this.setData({
        listData: res
      });
    });
  },

  // 支付
  pay(event) {
    let that=this;
    let token=wx.getStorageSync('token');
    let tokenid = wx.getStorageSync('tokenid');
    let pay_type = _base.getDataSet(event, 'pay_type');
    let soType = _base.getDataSet(event, 'sotype'); //验房订金的状态 支付成功不显示弹框


    let so_id = _base.getDataSet(event, 'id');
    console.log(so_id);
    // if (pay_type == 3){
      _api.pay(so_id, (res) => {
        console.log(res);
          wx.requestPayment({
            'timeStamp': "" + res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': "prepay_id=" + res.data.prepay_id,
            'signType': res.data.signType,
            'paySign': res.data.paySign,
            'success': function (res) {
              console.log("成功");
              if (res.errMsg == 'requestPayment:ok') {
                //订金不是验房的，就跳到的支付 成功页面；是验房的刷新列表
                if (soType!=3){
                  wx.redirectTo({
                    // url: '/pages/result/result-pay/result-pay'
                    url: '/pages/earnest/pay-result/result?payorder=2&payid=' + so_id + ''
                  })
                }else{
                  that.getDeposits()
                }
                  
              }
            },
            'fail': function (res) {
              console.log(res,'支付失败res')
            }
          })
      });
    // }
    // if (pay_type == 2) {
    //     console.log("sdjkgf ");
    //     that.setData({
    //       er_show: true,
    //     })
    //     wx.downloadFile({
    //       url: _base.baseRequestUrl + 'soinfo/pay.json?token=' + token + '&tokenid=' + tokenid + '&so_id=' + so_id,
    //       success: function (res) {
    //         console.log(res);
    //         that.setData({
    //           er_model: res.tempFilePath
    //         })
    //         //定时器判断是否支付成功
    //         let setin_pay=setInterval(function(){
    //           that.checkpay(so_id)
    //         },3000)
    //           that.setData({
    //             setin_pay: setin_pay
    //         })
    //       }
    //     })
    // }
  },
  checkpay(so_id){
    let that = this;
    _api.checkpay(so_id, (res) => {
      if(res.data==true){
        that.setData({
          er_show: false,
        })
        //支付成功后重新刷新数据
        clearInterval(this.data.setin_pay);
        let para=0;
        _api.getDeposits(para, (res) => {
          res.forEach((ele) => {
            ele.page_type = 'order';
          });
          this.setData({
            listData: res
          });
        });

      }
      if (res.data == false) {
      console.log("w345");
      }
    })
  },
  model_show(){
    this.setData({
      er_show: false,
    })
    clearInterval(this.data.setin_pay);
  },
  previewImage(){
    let that=this;
    wx.previewImage({
      current: that.data.er_model, // 当前显示图片的http链接
      urls: [that.data.er_model] // 需要预览的图片http链接列表
    })
  },

  changeDate(date){
    return date.split(' ')[0]
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
