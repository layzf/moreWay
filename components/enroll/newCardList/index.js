// components/enroll/newCardList/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type:Object,
      observer(newVal, oldVal) {
        console.log(newVal,"aa")
      }
    },
    width:{
      type:Number,
      value:70
    }
  },

  /**
   * 组件的初始数据
   */
  ready(){
    console.log(this.data.resp,"resp")
  },
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
