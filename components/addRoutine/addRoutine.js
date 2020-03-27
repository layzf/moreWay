// components/addRoutine/addRoutine.js
Component({
  /**
   * 组件的属性列表
   * 首次加载 group='' ,shareHome = ''  show
   * 大巴团 wx:if='{{shareHome}}'   hide
   * shareHome 分享进入页面 shareHome：1；  show
   * group 点击进入首页，shareHome=0,group=1  show
   */

  properties: {
    shareHome:{
      type: String
    },
    group:{
      type: String
    }
  },

 attached(){
   this.titles();
 },
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    titles:function(){
      var that = this;
     setTimeout(()=>{
       var animation = wx.createAnimation({
         duration: 2000,
         timingFunction: 'ease',
       })
       animation.opacity(0).step();
       this.setData({
         animationData: animation.export()
       })
       this.setData({
         group: 1,
         shareHome: 0
       })
     },6000)

    }
  }
})
