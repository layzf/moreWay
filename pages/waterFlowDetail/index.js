// pages/waterFlowDetail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //当前索引
    current:0,
    //所有图片的高度  
    imgheightsArr: [],
    background:[
      { imgs: 'http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190306144842/1001.png' },
      { imgs: '../../images/share.jpg' },
      { imgs: '../../images/share.jpg' },
      { imgs: 'http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190306144842/1001.png' },
    ],
    backgroundLength:4,
    imgWidth: 0,
    waterFlowShow:true,
    item: [  //评论信息
      {
        name: '琪琪',
        text: '四件套非常不错，超级亲肤，超级舒服，床单被 套特别的吸棉絮，很舒服，做工很好方便快捷， 谢谢，做工超赞，几乎没有什么多余的线头，超 级喜欢，服务态度很好，物流非常给力，比在实 体店看到的划算，在这家买，质量还是特别靠得 住的。满意。是我喜欢的。', icon: '../../images/share.jpg', date: '2019-10-14',            img: [
          { imgs: 'http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190306144842/1001.png' },
          { imgs: '../../images/share.jpg' },
          { imgs: '../../images/share.jpg' },
          { imgs: 'http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190306144842/1001.png' },
        ]
      }
    ],
    Pimage: [ //晒单推荐
      {
        pic: "http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190306144842/1001.png",
        height: 0
      },

      {
        pic: "http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190313090409/完美9.png",
        height: 0
      },
      {
        pic: "../../../images/share.jpg",
        height: 0
      },
      {
        pic: "http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190313090409/完美9.png",
        height: 0
      },
      {
        pic: "../../../images/custom.jpg",
        height: 0
      },
      {
        pic: "http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190313090409/完美9.png",
        height: 0
      },
    ],

    projectItem: {
      title: '格力中央空调1',
      name: '多联机系列/风管机',
      small: '234人已参团 · 了解详情'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;

        this.setData({
          imgWidth: imgWidth
        });
      }
    })

    //加载首组图片
    this.selectComponent('#waters').loadImages()

  },

  imgHeight: function (e) {
    var imgwidth = e.detail.width, 
        imgheight = e.detail.height,
        //宽高比  
        ratio = imgwidth / imgheight;

    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheightsArr = this.data.imgheightsArr;
    //把每一张图片的对应的高度记录到数组里  
    imgheightsArr[e.target.dataset.id] = imgheight;
    this.setData({
      imgheightsArr: imgheightsArr,
    })
  },
  bindchange(e) {
    this.setData({
      current: e.detail.current 
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
    //加载首组图片
    this.selectComponent('#waters').loadImages()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})