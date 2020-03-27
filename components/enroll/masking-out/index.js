// components/enroll/masking-out/index.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {
    heightMasking:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showModalStatus: false,
    animationData: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showModal: function () {
      // 显示遮罩层
      var animation = wx.createAnimation({
        duration: 600,
        timingFunction: "ease-in-out",
        delay: 0
      })
      this.animation = animation
      animation.translateY(1600).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
    },
    hideModal: function () {
      var animation = wx.createAnimation({
        duration: 600,
        timingFunction: "linear",
        delay: 0
      })
    
      animation.translateY(1600).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(1600).step()
        this.setData({
          animationData: animation.export(),
          showModalStatus: false
        })
      }.bind(this), 200)
    }
  }
})
