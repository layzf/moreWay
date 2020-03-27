// components/scaleImg/scaleimg.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    img:{
      type:String,
      value:'../../images/default.png'
    },
    show:{
      type:Boolean,
      value:false
    },
    mask:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    height:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
      hideImg(){
        this.setData({
            show:false
        })
      }
  },
  lifetimes:{
    ready(){
      let h = wx.getSystemInfoSync().windowHeight
      this.setData({
          height:h
      })
    }
  }
})
