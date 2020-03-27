// components/getUserInfo/index.js
import {
  Base
} from '../../utils/base.js';
import {
  Api
} from '../../utils/api.js';
import {
  login
} from '../../utils/login.js';

let _base = new Base();
let _api = new Api();
let _login = new login();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userInfoModelFlag:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    checked:true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    checkboxChange:function(e){
      console.log(e)
      if(e.detail.value.length){
        console.log('勾选')
        this.setData({
          checked:false
        })
      }else{
        this.setData({
          checked: true
        })
      }
    },
    //用户协议
    userBook:function(e){
      var tag = e.currentTarget.dataset.tag;
      console.log(123)
      wx.navigateTo({
        url: `/pages/userBook/index?tag=${tag}`,
      })
    },
    getUser: function (e) {
      let that = this;
      console.log(e, "aaaa")
      if (e.detail.errMsg == "getUserInfo:ok") {

        var name = e.detail.userInfo.nickName;

        var avatarUrl = e.detail.userInfo.avatarUrl;

        wx.setStorageSync('avatarUrl', avatarUrl);
        wx.setStorageSync('nickName', name);
        wx.setStorageSync('encrypted', e.detail);

        _login.getToken(name, avatarUrl).then(res => {
          let user = wx.getStorageSync('loginUser');
          this.triggerEvent('loginTrue', user)

          this.setData({
            userInfoModelFlag: false
          })

        })
       
      } else {
        console.log('授权失败');
      }
    },
  }
})
