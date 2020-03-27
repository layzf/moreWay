// components/slideImg/slide.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      list:{
          type:Array,
          value:[]
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    width:wx.getSystemInfoSync().windowWidth,
    start:null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
      touchStart(e){
        console.log('开始触摸:',e);
        //let start = e.changedTouches[0].pageX;
      },
      touchMove(e){
        console.log('开始触摸',e);
      },
      touchEnd(e){
        console.log('触摸j结束',e);
        //let end = e.changedTouches[0].pageX;
      },
      slideState(){
          let dist = this.data.distance;

      },
      slideAnimation(dist){

      }
  },

  //生命周期
  lifetime:{
      attached(){

      },
      ready(){

      }
  }
})
