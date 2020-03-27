// components/y-detailMoel-1/index.js
Component({
  /**
   * 组件的属性列表
   */



  properties: {
    swiperMoel_1:{
      type:Array,
      value:[]
    },
    type:{
      type:String,
      value:''
    },
    appliedSum:{  //成团人数
      type: String,
      value: ''
    },
    groupSum:{  //要求成团人数
      type: String,
      value: ''
    },
    name:{  //验房团名字
      type: String,
      value: ''
    },
    y_day:{
      type:String,
      value:''
    },
    groupList:{
      type:Array,
      observer:function(data){
        var that = this;
        console.log('子组件', data)
        if(data!='' && data.length>0){
          that.setData({
            grounpList: data
          })
        }
      }
    }
  },


  data: {
    grounpList:[],
    height:''
  },
    ready: function () {
      //创建节点选择器
      var that = this;

      // if (this.data.grounpList.length!=''){

      //     const query = wx.createSelectorQuery().in(this)
      //     query.select('.newflex-row').boundingClientRect(function (res) {
      //       that.setData({
      //         height: res.height + 30
      //       })
      //     }).exec()
      // }

    },
  methods: {
    catchTouchMove: function () {
      return false
    },
  },

  pageLifetimes: {
    show: function () {
      // 页面被展示
      var that = this;
      console.log("了帮我问问", this.data.grounpList.length)

       setTimeout(()=>{
         if (this.data.grounpList.length <= 0) {
           that.setData({
             height: 33
           })
         }else{
           const query = wx.createSelectorQuery().in(this)
           query.select('.newflex-row').boundingClientRect(function (res) {
             console.log(res, "啊啊啊")
             that.setData({
               height: res.height + 30
             })
           }).exec()

         }
        

       },100)

    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  }

})
