
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentArr:[],
    cateItems: [
      {
        cate_id: 1,
        cate_name: '洗护',
        children: [
          {
            title: '格力中央空调1',
            name: '多联机系列/风管机',
            small: '234人已参团 · 了解详情'
          },
          {
            title: '格力中央空调1',
            name: '多联机系列/风管机',
            small: '234人已参团 · 了解详情'
          },
        ]
      },
      {
        cate_id: 2,
        cate_name: '生鲜',
        children:[
          {
            title: '格力中央空调2',
            name:'多联机系列/风管机',
            small:'234人已参团 · 了解详情'
          },
          {
            title: '格力中央空调2',
            name: '多联机系列/风管机',
            small: '234人已参团 · 了解详情'
          }, {
            title: '格力中央空调2',
            name: '多联机系列/风管机',
            small: '234人已参团 · 了解详情'
          },
        ]
      },
      {
        cate_id: 3,
        cate_name: '食品',
        children: [
          {
            title: '格力中央空调3',
            name: '多联机系列/风管机',
            small: '234人已参团 · 了解详情'
          },
          {
            title: '格力中央空调3',
            name: '多联机系列/风管机',
            small: '234人已参团 · 了解详情'
          }, {
            title: '格力中央空调3',
            name: '多联机系列/风管机',
            small: '234人已参团 · 了解详情'
          },
        ]
      },
      {
        cate_id: 4,
        cate_name: '女装',
      children: [
        {
          title: '格力中央空调4',
          name: '多联机系列/风管机',
          small: '234人已参团 · 了解详情'
        },
        {
          title: '格力中央空调4',
          name: '多联机系列/风管机',
          small: '234人已参团 · 了解详情'
        }, {
          title: '格力中央空调4',
          name: '多联机系列/风管机',
          small: '234人已参团 · 了解详情'
        },
      ]
      },
      {
        cate_id: 5,
        cate_name: '百货'
      },
      {
        cate_id: 6,
        cate_name: '母婴'
      },
      {
        cate_id: 7,
        cate_name: '母婴'
      },
      {
        cate_id: 8,
        cate_name: '母婴'
      },
      {
        cate_id: 9,
        cate_name: '母婴'
      },
      {
        cate_id: 10,
        cate_name: '母婴'
      },
      {
        cate_id: 11,
        cate_name: '母婴'
      },
      {
        cate_id: 12,
        cate_name: '母婴'
      },
      {
        cate_id: 13,
        cate_name: '母婴'
      },
      {
        cate_id: 14,
        cate_name: '母婴'
      }
    ],
    curIndex: 0,
    navScrollTop:0, //导航移动距离
    oneShow:true,
    heightArr:0,
    zindex:0,
  },
  //事件处理函数  
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值  
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    // 把点击到的某一项，设为当前index  
    this.setData({
      curIndex: index
    })
    this.navScroll(index)
  },
  //右侧内容触碰到底部事件
  bindscroll:function(e){
    var zindex = this.data.zindex;
    var oneShow = this.data.oneShow;
    let scrollTop = e.detail.scrollTop;
    let scrollArr = this.data.heightArr;

    for (let i = 0; i < scrollArr.length; i++) {
      if (scrollTop >= 0 && scrollTop < scrollArr[0]) {
        if (oneShow) {
          console.log('==============aaa' + scrollTop + "==" + scrollArr[0]);
          this.setData({
            curIndex: 0,
            zindex: 0,
            oneShow: false
          })
          return
        }
      } else if (scrollTop >= (scrollArr[i - 1]) && scrollTop < scrollArr[i]) {
        if (i != zindex) {
          console.log('==============bbb' + i + scrollTop + "==" + scrollArr[i]);
          this.setData({
            oneShow: true,
            zindex: i,
            curIndex: i,
          })

        }

      }
    }

  },
  //导航条高亮居中
  navScroll: function (index){
    //每一块占1/12屏幕的高度
    var singleNavHeight = wx.getSystemInfoSync().windowHeight ;

   //想要高亮居中，先定义一个平均值，再用当（前索引 - 平均值） * 每一块的高度。
    if (this.data.curIndex > 5) {
      this.setData({
        navScrollTop: (index - 5) * (singleNavHeight / 12)
      })
    } else {
      this.setData({
        navScrollTop: 0
      })
    }

  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var item =  this.data.cateItems;
    var list = []
    var obj = {};
    
    item.forEach( item => {

      if (item.children && item.children.length){
         list.push(item.children)
         obj['arr'] = list 
      }
    })
    this.setData({
      contentArr: obj
    })


  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var h = 0;
    var heightArr = [];

    wx.createSelectorQuery().selectAll('.commonViews').boundingClientRect(function (rect) {//selectAll会选择所要含有该类名的盒子
    }).exec(function (res) {
      res[0].forEach((item) => {
        h += item.height;
        heightArr.push(h);
      })
      that.setData({ heightArr: heightArr })
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