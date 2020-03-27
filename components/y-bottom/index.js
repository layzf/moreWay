// components/y-bottom/index.js
import {
  Api
} from '../../utils/api.js';
import {
  login
} from '../../utils/login.js';

let _api = new Api();
let _login = new login();

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
    //是否有昵称名字
    isLogin:{
      type:Object,
      value:()=>{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },




  methods: {
    //显示弹框
    showOrderModel:function(){
      this.triggerEvent("modelShow",true)
    },

  //联系团长
    callCapital:function(){
      this.triggerEvent("callCapital")
    }


  }
})
