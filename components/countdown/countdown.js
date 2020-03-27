// components/countdown/countdown.js
let timeData = {
    day:'00',
    hour:'00',
    minute:'00',
    second:'00',
    isOver:false
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    countType:{
      type:String,
      value:'second'
    },
    time:{
      type:String,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
      ...timeData
  },

  /**
   * 组件的方法列表
   */
  methods: {
    doCountDown(){
      let type = this.data.countType;
      let time = this.data.time;
      let that = this;
      let timer = null;
      let {day,hour,minute,second} = timeData;
      switch (type) {
          case 'day':
            time = time*24*60*60;
            break;
          case 'hour':
            time = time*60*60;
            break;
          case 'minute':
            time = time*60;
            break;
          case 'custorm':
            let now = new Date().getTime()/1000;
            let date = new Date(time.replace(/-/g,'/'))
            time = date.getTime()/1000 - now;
      }
      console.log('距离结束时间',time);
      timer = setInterval(()=>{
          if(time>0){
              day = Math.floor(time/(60*60*24));
              hour = Math.floor(time/(60*60) - day*24);
              minute = Math.floor(time/(60) - day*24*60 -hour*60);
              second = Math.floor(time - day*24*60*60 -hour*60*60 -minute*60);
              if(day<=9) day = '0'+day;
              if(hour<=9) hour = '0'+hour;
              if(minute<=9) minute = '0'+minute;
              if(second<=9) second = '0'+second;
              that.setData({
                  day:day,
                  hour:hour,
                  minute:minute,
                  second:second
              })
              time--;
          }else{
              that.setData({
                  day:'00',
                  hour:'00',
                  minute:'00',
                  second:'00',
                  isOver:true
              })
              console.log('执行完毕');
              clearInterval(timer);
          }
      },1000)
    }
  },
  lifetimes:{
    attached(){
      //console.log('attach');
      this.doCountDown();
    }
  }
})
