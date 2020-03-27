// components/tip/tip.js
import {
    Base
} from '../../utils/base.js';
import {
    Api
} from '../../utils/api.js';
let _base = new Base();
let _api = new Api();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      type:{
          type:Number,
          value:null
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show:false,
    userInfo:null,
    userAuts:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
      toPage(){
        let user = this.data.userAuts;
        console.log(user,"user")
        if (!user){
          wx.navigateTo({
              url: '/pages/my/my-member/member-estate-auth/estate-auth-form/estate-auth-form'
          })
        } else if (user && user.status==0){
          wx.navigateTo({
              url: '/pages/my/my-member/member-estate-auth/auth-form-res/auth-form-res'
          })
        }
          // if(user && user.userAut){
          //     if(user.userAut.status === -1){
          //         wx.navigateTo({
          //             url: '/pages/my/my-member/member-estate-auth/estate-auth-form/estate-auth-form'
          //         })
          //     }else if(user.userAut.status === 0){
          //         wx.navigateTo({
          //             url: '/pages/my/my-member/member-estate-auth/auth-form-res/auth-form-res?commitSuccess=1'
          //         })
          //     }
          // }else if(user){
          //     wx.navigateTo({
          //         url: '/pages/my/my-member/member-estate-auth/estate-auth-form/estate-auth-form'
          //     })
          // }
      },
      showLogin(){
        let that = this;
        _api.diffState(res => {
          console.log(res,"aaaawww")
          if (JSON.stringify(res.data) != "{}"){
            // 用户会员信息
            this.setData({
              userAuts: res.data.userInfo.userAut
            })
            let userInfo = res.data ? res.data.userInfo : {}
            console.log(`%c des`, `color:#f00;font-weight:bold;`, userInfo)

            if (userInfo && userInfo.userAut) {
              wx.setStorageSync('isLogin', true);
              wx.setStorageSync('isAuth', true);
              if (userInfo.userAut.status === 1 || (userInfo.userAut.status == 0 && userInfo.userAut)) {
                this.setData({
                  show: false
                })
              }
            } else {
              if (userInfo) {
                console.log(`%c 到这里了`, `color:#f00;font-weight:bold;`)
                wx.setStorageSync('isLogin', true);
                wx.setStorageSync('isAuth', false);
                if (that.data.type !== null) {
                  if (that.data.type > 0) {
                    that.setData({
                      show: true,
                      userInfo: userInfo
                    })
                  } else {
                    that.setData({
                      show: false,
                      userInfo: userInfo
                    })
                  }
                } else {

                  that.setData({
                    show: true,
                    userInfo: userInfo
                  })
                }
              } else {
                wx.setStorageSync('isLogin', false);
                that.setData({
                  show: false
                })
              }
            }
          }
         
        })
      }
  },
    pageLifetimes :{
      ready(){
          let that = this;
          that.showLogin()
      }
  }

})
