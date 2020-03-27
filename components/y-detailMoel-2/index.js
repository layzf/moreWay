// components/y-detailMoel-2/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
   //活动状态 
    type: {
      type: String,
      value: ''
    },
    grouped_discount:{ //组团价格
      type: String,
      value: ''
    },
    personnal_discount:{ //不组团价格
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */

  ready(){
    console.log(this.data.type,"typetypetype")
  },
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
