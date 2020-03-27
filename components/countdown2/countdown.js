/**
 * 使用：
 * 
 *  <countdown countType="custorm" time="2020-02-14 11:08:30" hasDays='true'></countdown>
 * 
 *  <countdown countType="hour" time="2020-02-14 11:08:30" hasDays='false'></countdown>
 * 
 *  @Parma countType=hour 显示时分秒
 * 
 *  @Parma countType=custorm 显示日时分秒
 * 
 *  @Parma hasDays 显示天数 !hasDays 不显示天数
 * 
 */

//只显示时分秒的倒计时
function hourDuring(time) {
  let hour = hour = Math.floor(time / 3600);
  let minute = minute = Math.floor((time - hour * 3600) / 60);
  let second =   second = Math.floor(time - hour * 3600 - minute * 60);

        return {
          hour: hour,
          minute: minute,
          second: second,
        }
    }
//显示天、时分秒倒计时
function custormDuring(time){

  let day = Math.floor(time / (60 * 60 * 24));
  let hour = Math.floor(time / (60 * 60) - day * 24);
  let minute = Math.floor(time / (60) - day * 24 * 60 - hour * 60);
  let second = Math.floor(time - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60);

  return {
    day: day,
    hour: hour,
    minute: minute,
    second: second,
  }

}
let timeData = {
  day: '0',
  hour: '00',
  minute: '00',
  second: '00',
  isOver: false
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    countType: {
      type: String,
      value: 'second'
    },
    time: {
      type: String,
      value: 0
    },
    hasDays:{
      type: Boolean,
      value: false
    },
    fontSizeColor:{
      type:String,
      value:''
    },
    bgColor: {
      type: String,
      value: ''
    },
    dataColor:{
      type: String,
      value: ''
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
    timer(time, type){
      let that = this;
      let timer = null;
        
      let { day, hour, minute, second }  = {}
 
      timer = setInterval(() => {
        if (time > 0) {

          if (type == 'hour') {
            ({ day = 0, hour, minute, second } = hourDuring(time))

          } else if (type == 'custorm') {
            ({ day, hour, minute, second } = custormDuring(time))
          }

          if (day <= 9 && day != 0) day = '0' + day;
          if (hour <= 9) hour = '0' + hour;
          if (minute <= 9) minute = '0' + minute;
          if (second <= 9) second = '0' + second;
          that.setData({
            day: day,
            hour: hour,
            minute: minute,
            second: second
          })
          time--;
        } else {
          that.setData({
            day: '0',
            hour: '00',
            minute: '00',
            second: '00',
            isOver: true
          })
          console.log('执行完毕');
          clearInterval(timer);
        }
      }, 1000)


    },
    doCountDown() {
      let type = this.data.countType;
      let time = this.data.time;

      let now = new Date().getTime() / 1000;
      let date = new Date(time.replace(/-/g, '/'))
      time = date.getTime() / 1000 - now;

      this.timer(time, type)
 
    }
  },
  lifetimes: {
    attached() {
      //console.log('attach');
      this.doCountDown();
    }
  }
})
