// components/slide/slide.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    autoplay:{
      type:Boolean,
      value:true
    },
    baseSize:{
      type: Number,
      value:80
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgList:[0,1,2],
    copyList:[0,1,2],
    width:0,
    index:0,
    left:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    autoPlay(){
      let len = this.data.imgList.length;
      let left = this.data.left;
      let index = this.data.index;
      let base = this.data.baseSize;
      let timer = null;
      timer = setInterval(()=>{
          left = -base + index * -base;
          index++;
          this.setData({
              left:left
          })
      },1000)
    }
  },
  lifetimes:{
    attached(){
      let len = this.data.imgList.length;
      let auto = this.data.autoplay;
      this.setData({
          width:2*len*this.data.baseSize,
          copyList:this.data.imgList
      })
      if(auto){
        this.autoPlay();
      }
    }
  }
})
