Page({

  /**
   * 页面的初始数据
   */
  data: {
    waterFlowShow:false,
    curIndex: '',
    curs:0,
    navHeight:'',
    heightArr:[],//评论，拼团详情，拼团须知 距顶部距离
    navFlag:{
      topNavFlag: false,//点击导航滚动到对应元素位置，移动过程中导航条隐藏
      topNavMove: 0,//滚动到对应位置距离顶部的高度
    },
    
    item: [
      {
        name:'琪琪',
        text: '四件套非常不错，超级亲肤，超级舒服，床单被 套特别的吸棉絮，很舒服，做工很好方便快捷， 谢谢，做工超赞，几乎没有什么多余的线头，超 级喜欢，服务态度很好，物流非常给力，比在实 体店看到的划算，在这家买，质量还是特别靠得 住的。满意。是我喜欢的。', icon: '../../images/share.jpg', date: '2019-10-14', img: [
          { imgs: 'http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190306144842/1001.png' },
          { imgs: '../../images/share.jpg' },
          { imgs: '../../images/share.jpg' },
          { imgs: 'http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190306144842/1001.png' },
        ]
      },
      {
        name: '琪琪',
        text: '四件套非常不错，超级亲肤，超级舒服，床单被 套特别的吸棉絮，很舒服，做工很好方便快捷， 谢谢，做工超赞，几乎没有什么多余的线头，超 级喜欢，服务态度很好，物流非常给力，比在实 体店看到的划算，在这家买，质量还是特别靠得 住的。满意。是我喜欢的。', icon: '../../images/share.jpg', date: '2019-10-14', img: [
          { imgs: 'http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190306144842/1001.png' },
          { imgs: '../../images/share.jpg' },
          { imgs: 'http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190306144842/1001.png' },
          { imgs: '../../images/share.jpg' },
        ]
      },
      {
        name: '琪琪',
        text: '四件套非常不错，超级亲肤，超级舒服，床单被 套特别的吸棉絮，很舒服，做工很好方便快捷， 谢谢，做工超赞，几乎没有什么多余的线头，超 级喜欢，服务态度很好，物流非常给力，比在实 体店看到的划算，在这家买，质量还是特别靠得 住的。满意。是我喜欢的。', icon: '../../images/share.jpg', date: '2019-10-14', img: [
          { imgs: 'http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190306144842/1001.png' },
          { imgs: '../../images/share.jpg' },
          { imgs: '../../images/share.jpg' },
          { imgs: '../../images/share.jpg' },
        ]
      },
      {
        name:'琪琪',
        text: '四件套非常不错，超级亲肤，超级舒服，床单被 套特别的吸棉絮，很舒服，做工很好方便快捷， 谢谢，做工超赞，几乎没有什么多余的线头，超 级喜欢，服务态度很好，物流非常给力，比在实 体店看到的划算，在这家买，质量还是特别靠得 住的。满意。是我喜欢的。', icon: '../../images/share.jpg', date: '2019-10-14', img: [
          { imgs: '../../images/share.jpg' },
          { imgs: '../../images/share.jpg' },
          { imgs: '../../images/share.jpg' },
          { imgs: '../../images/share.jpg' },
        ]
      },
      {
        name: '琪琪',
        text: '四件套非常不错，超级亲肤，超级舒服，床单被 套特别的吸棉絮，很舒服，做工很好方便快捷， 谢谢，做工超赞，几乎没有什么多余的线头，超 级喜欢，服务态度很好，物流非常给力，比在实 体店看到的划算，在这家买，质量还是特别靠得 住的。满意。是我喜欢的。', icon: '../../images/share.jpg', date: '2019-10-14', img: [
          { imgs: '../../images/share.jpg' },
          { imgs: '../../images/share.jpg' },
          { imgs: '../../images/share.jpg' },
          { imgs: '../../images/share.jpg' },
        ]
      },

    ],
    commanderHiden:false,
    showTab: Boolean,
    height:0
  },
  //吸顶切换
  topNavClick(e){
    var index = e.currentTarget.dataset.index;
    var heightArr = this.data.heightArr;


    var scrollArr = heightArr.map(item => item = item - (this.data.navHeight - 5))

    this.setData({
      curIndex:index,
      curs:index,
    })
    

    if (index == 0) {

    //因为scrollTopFun事件中判断 当页面滚动距离大于heightArr[0]显示，小于则隐藏， 加2 为了点击 index == 0 导航消失
      this.setData({
        'navFlag.topNavMove': scrollArr[0] + 2  
      })
    } else if (index == 1 ) {
      this.setData({
        'navFlag.topNavMove': scrollArr[1]
      })
    } else if (index == 2) {
      this.setData({
        'navFlag.topNavMove': scrollArr[2]
      })
    }


  },
  //咨询团长
  callCapital() {
    let h = wx.getSystemInfoSync().windowHeight;
    this.selectComponent('#my-commander').getInfo()
    this.setData({
      height: h,
      commanderHiden: true,
      showTab: false
    })
  },
  //显示底部蒙版
  showModal(){
    this.selectComponent('#masking').showModal()
  },
  //隐藏底部蒙版
  hideModal(){
    this.selectComponent('#masking').hideModal()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let h = wx.getSystemInfoSync().windowHeight;

    var query = wx.createSelectorQuery();
 
    this.setData({
      height:h
    })
  },
//滚动事件
  scrollTopFun(e){  
 
    let scrollTop = e.detail.scrollTop;
    let heightArr = this.data.heightArr;

  //距离顶部高度 统一 加上导航条的高度
    var scrollArr = heightArr.map(item => item = item - this.data.navHeight)
 
  //当页面滚动距离大于heightArr[0]导航显示，小于则隐藏

    if (scrollTop > scrollArr[0]){
      this.setData({
        'navFlag.topNavFlag': true
      })

    }else{
      this.setData({
        'navFlag.topNavFlag': false
      })
    }
    //滚动距离比较每个元素距离顶部高度，判断导航index高亮
    if (scrollTop >= scrollArr[0] && scrollTop < scrollArr[1]){
      console.log('scrollTop:', scrollTop, ' scrollArr[0]:', scrollArr[0], '===', scrollArr[1])

      this.setData({
        curs: 0
      })
    } else if (scrollTop >= scrollArr[1] && scrollTop < scrollArr[2]){
      console.log('scrollTop:', scrollTop, ' scrollArr[1]:', scrollArr[1], '===', scrollArr[2])
      this.setData({
        curs: 1
      })
                                                   
    } else if (scrollTop >= scrollArr[2]){
      this.setData({
        curs: 2
      })
      console.log('scrollTop:', scrollTop, ' scrollArr[2]:', scrollArr[2])
    }

  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var heightArr = [];

    //selectAll会选择所要含有该类名的盒子

    //获取每个selectAll盒子距离顶部高度
    
    wx.createSelectorQuery().selectAll('.commonViews').boundingClientRect(function (rect) {
    }).exec(function (res) {
      res[0].forEach((item) => {
        console.log(item)
        heightArr.push(item.top);
      })
      that.setData({ heightArr: heightArr })
    })

    wx.createSelectorQuery().selectAll('.opacte').boundingClientRect(function (rect) {
    }).exec(function (res) {
      that.setData({ navHeight: res[0][0].height})
    })

    
     
    

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