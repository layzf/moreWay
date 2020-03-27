// components/comment/index.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    waterFlowShow:{
      type:Boolean,
      value:false
    },
    item:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _previewImage: function(e) {
        console.log(e)
        var index = e.currentTarget.dataset.index, item = e.currentTarget.dataset.item;
        var arr = item.map(items => items.imgs)

        app.previewImage(arr, index)
      },
  }
})
