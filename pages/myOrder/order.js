// pages/myOrder/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //当前的选中的选项
    checkItem:0,
    res:[1,2,3],
    height:wx.getSystemInfoSync().screenHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  //切换选项
  checkItem:function(e){
    let id = parseInt(e.currentTarget.id);
    this.setData({checkItem:id});
  },

  //内容滑动
  changeIndex:function(e){
    this.setData({checkItem:e.detail.current})
  }
})
