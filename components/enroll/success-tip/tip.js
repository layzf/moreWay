// components/enroll/success-tip/tip.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showLogin:{
      type:Boolean,
      value:false
    },
    mask:{
      type:Boolean,
      value: false
    },
    shopTip:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
      height:wx.getSystemInfoSync().windowHeight,//屏幕高度
  },

  /**
   * 组件的方法列表
   */
  methods: {
      closeTip(){
        this.triggerEvent('hideRow',{},{});
      }
  }
})
