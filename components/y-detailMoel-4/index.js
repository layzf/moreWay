// components/y-detailMoel-4/index.js
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
//收費标准
    houseCheckFeesList: {
      type: Array,
      observer: function (data) {
        var that = this;
        if (data != '' && data.length > 0) {
          that.setData({
            list: data
          })
        }
      }
    },
    status:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
