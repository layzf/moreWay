// components/enroll/login/login.js
import {
    Base
} from '../../../utils/base.js';
import {
    Api
} from '../../../utils/api.js';

let defaultData = {
    inputData:{
        phone:'',
        code:''
    },
    code:{
        time:60,
        txt:'获取验证码',
        canUse:true
    },
    height:wx.getSystemInfoSync().windowHeight
}
let _base = new Base();
let _api = new Api();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      isShow:{
        type:Boolean,
        value:false
      },
      mask:{
          type:Boolean,
          value:false
      },
      isCollect:{
          type:Boolean,
          value:false
      },
      isCode:{
          type:Object,
          value:{}
      },
      collect:{
          type:Number,
          value:0
      },
      isSub:{
          type:Boolean,
          value:false
      },
      cid:{
          type:Number,
          value:0
      },
      isAuth:{
          type:Boolean,
          value:false
      },
      village:{
          type:Object,
          value:{}
      },
      isBottom:{
          type:Boolean,
          value:false
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
      ...defaultData
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideLine(e){
      this.triggerEvent('hideRowLogin', {e},{});
    },
      //输入
    getData(e){
        let val = e.detail.value;
        let input = this.data.inputData;
        let id = e.target.id;
        if(id === 'phone'){
            input.phone = val;
        }else{
            input.code = val;
        }
        this.setData({
            inputData:input
        })
    },
      //获取验证码
    getCode(){
          let code = this.data.code;
          let input = this.data.inputData;
          //验证手机号
           if (!(/^1[3456789]\d{9}$/.test(input.phone))){
              wx.showToast({
                  title:'手机号不正确',
                  duration:1000,
                  image:'../../../images/jinggao.png'
              });
              return false;
          }else{
              let timer = setInterval(()=>{
                  let t = code.time;
                  if(t>0){
                      t--;
                      code.time = t;
                      code.txt = '剩余'+t+'秒';
                      code.canUse = false;
                  }else{
                      t = 60;
                      code.time = t;
                      code.txt = '获取验证码';
                      code.canUse = true;
                      clearInterval(timer);
                  }
                  this.setData({
                      code:code
                  })
              },1000);
              _api.getCode(input.phone, 1, (res) => {
                  console.log(res);
                  _base.showToast('验证码已发送至手机', 'success');
              });
          }
      },
    //验证
    formValidateLogin: function(phone, code) {
          var result = {
              status: false,
              msg: ''
          }
          if (!_base.validate(phone, 'require')) {
              result.msg = '请输入手机号';
              return result;
          }
          if (!_base.validate(phone, 'phone')) {
              result.msg = '手机号格式不正确';
              return result;
          }
          if (!_base.validate(code, 'require')) {
              result.msg = '请输入验证码';
              return result;
          }
          result.status = true;
          result.msg = '';
          return result;
      },
    //登录
    login(){
        console.log('isSub',this.data.isSub);
        let phone = this.data.inputData.phone;
        let code = this.data.inputData.code;
        let option = this.data.isCode;
        let collect = this.data.collect;
        let that = this;
        console.log('login组件option',option);
        let validateResult = this.formValidateLogin(phone, code);
        if (!validateResult.status) {
            wx.showToast({
                title:validateResult.msg,
                image: '../../../images/jinggao.png',
                duration:1000
            })
            return false;
        }
        this.setData({
            loadingLogin: true,
            disabledLogin: true
        });
        _api.doLogin(phone, code, (res) => {
            if (res.resultCode == 1000) {
                this.setData({
                    loadingLogin: false,
                    disabledLogin: false
                });
                console.log(res);
                let user = res.data.loginUser;
                wx.setStorageSync("loginStatus", res.data.loginstatus);
                wx.setStorageSync("loginUser", res.data.loginUser);
                wx.setStorageSync("reqPhone", phone);


              var hideRowLoginObj = {}; 
                  hideRowLoginObj.hiddens = false; 
                  hideRowLoginObj.user = user;
                  hideRowLoginObj.suc = true;
              this.triggerEvent('hideRowLogin', hideRowLoginObj);

                wx.showToast({
                    title: '登录成功',
                    icon: 'success',
                    duration: 1000,
                    success: function() {

                        if(option && option.isCode && that.data.isSub === false){
                            let d = JSON.parse(option.data);
                            d.uid = res.data.loginUser.id;
                            _api.isSignIn(d,resd=>{
                                if(resd.resultCode===1000){
                                    wx.reLaunch({
                                        url: '/pages/r-success/success?success=true'
                                    })
                                }else if(resd.resultCode === 1004){
                                    wx.reLaunch({
                                        url: '/pages/r-main/main?data='+JSON.stringify(d)
                                    })
                                }else{
                                    wx.reLaunch({
                                        url: '/pages/r-success/success?success=false'
                                    })
                                }
                            })
                        }else if(that.data.isCollect && that.data.isSub === false){
                            if(collect){
                                user.collect = collect;
                            }
                            that.triggerEvent('collect',{user},{});
                            that.hideLine();
                        }
                        // else if(that.data.isSub){    progressDetail不知道干啥用的，好像没用
                        //     _api.progressDetail(that.data.cid, (res) => {
                        //         wx.hideLoading();
                        //         if(res.data.so_info){
                        //             that.triggerEvent('subData',{res},{});
                        //         }else{
                        //             that.triggerEvent('hideRowLogin',{},{});
                        //             wx.navigateTo({
                        //                 url: '/pages/my/my-deposit/deposit-add/deposit-add?id=' + that.data.cid
                        //             })
                        //         }
                        //     });
                        // }
                        else if(that.data.isAuth){
                            let village = that.data.village;
                            wx.navigateTo({
                                url: "/pages/my/my-member/member-estate-auth/estate-auth-form/estate-auth-form?village_name=" + village.village_name + "&village_id=" + village.village_id,
                            })
                        }else{
                            that.triggerEvent('hideRowLogin',{},{});
                        }
                    }
                })
            } else {
                console.log("请求失败");
            }
        });
    }
  },
})
