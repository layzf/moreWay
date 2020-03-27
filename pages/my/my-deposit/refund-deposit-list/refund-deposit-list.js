import { Base } from '../../../../utils/base.js';
import { Api } from '../../../../utils/api.js';
var _base = new Base();
var _api = new Api();
Page({
  data: {
    tabsData: {
      tabs: [
        {
          status: 1,
          title: '退订金申请'
        },
        {
          status: 2,
          title: '退订金记录'
        }
      ],
      currentSelectTab: "",
    },
    listData: [],
    aa:2,
  },

  onLoad: function (options) {
    console.log(options);
    let tabsData = this.data.tabsData;
    tabsData.currentSelectTab = options.type || 1;
    this.setData({
      tabsData: tabsData,
    });
    this.refund_deposit();
  },

  onTabsItemTap: function (event) {
    let tabId = _base.getDataSet(event, 'status');
    let tabsData = this.data.tabsData;
    tabsData.currentSelectTab = tabId;
    // console.log(tabsData.currentSelectTab);
    this.setData({
      tabsData: tabsData
    });
    console.log("这是");
    console.log(tabsData.currentSelectTab);
    this.refund_deposit();
  },
  refund_deposit() {
    let that = this;
    let para = this.data.tabsData.currentSelectTab;

    if (para==1){
      _api.refund_deposit(para, (res) => {
        res.forEach((ele) => {
          ele.page_type = 'deposit';
          ele.status = _base.changState(ele.status);
          ele.pay_at = that.changeDate(ele.pay_at);
          ele.end_at = that.changeDate(ele.end_at);
          ele.update_at = that.changeDate(ele.update_at);
        });
        this.setData({
          listData: res
        });
      });
    }else{
      _api.record_deposit((res) => {
        console.log(res, 'hahahaha');
        res.forEach((ele) => {
          ele.page_type = 'deposit';
          ele.menu_type = 1;
          ele.state = ele.status;
          ele.status = _base.changState(ele.status,1);
          ele.create_at = that.changeDate(ele.create_at);
          ele.update_at = that.changeDate(ele.update_at);
          ele.end_at = that.changeDate(ele.end_at);
        });
        this.setData({
          listData: res
        });
      });
    }

  },
    changeDate(date){
      if (date) {
        return date.split(' ')[0]
      }
    },
  // 申请退定金
  cancelDeposit(event) {
    const id = _base.getDataSet(event, 'id')
    const village_name = _base.getDataSet(event, 'village_name')
    const project_name = _base.getDataSet(event, 'project_name')
    const img_url = _base.getDataSet(event, 'img_url')
    const pay_price = _base.getDataSet(event, 'pay_price')
    const page_type = _base.getDataSet(event, 'page_type')
      console.log('id',id)
    wx.showModal({
      content: '确定要申请退订金吗？',
      confirmColor: '#E94816',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: `/pages/my/my-deposit/refund-deposit-apply/refund-deposit-apply?id=${id}&village_name=${village_name}&project_name=${project_name}&img_url=${img_url}&pay_price=${pay_price}&page_type=${page_type}`
          })
        }
      }
    })
  },

  // 取消申请
  cancel(event) {
    let that = this
    let id = _base.getDataSet(event, 'id');
    wx.showModal({
      content: '确定要取消申请退订金吗？',
      confirmColor: '#E94816',
      success: function (res) {
        if (res.confirm) {
          _api.cancel_deposit(id, (res) => {
            console.log(res)
            if (res.resultCode == 1000) {
              wx.showToast({
                title: '取消成功！',
              })
              that.refund_deposit();
            }
          })
        }
      }
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
