// components/sw/step/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cur:{
      type:Number,
      value:0
    },
    typeSetp:{
      type: Number,
      value:1
    },
    isShowCoun:{ //0 显示 1 隐藏
      type: Number,
      value:0
    }
  },

  ready: function () {
    console.log(this.data.isShowCoun, "res")
  },

  data: {
    step: [
      { num: 1, text: '选户型' },
      { num: 2, text: '选配置' },
      { num: 3, text: '约量尺' },
    ],

    step1: [
      { num: 1, text: '选户型' },
      { num: 2, text: '选方案' },
      { num: 3, text: '选配置' },
      { num: 4, text: '约量尺' },
    ],

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
