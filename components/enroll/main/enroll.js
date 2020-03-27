// components/enroll/main/enroll.js
import {
    Base
} from '../../../utils/base.js';
import {
    Api
} from '../../../utils/api.js';
import {
  login
} from '../../../utils/login.js';

let _base = new Base();
let _api = new Api();
let _login = new login();

const throttles = require('../../../utils/throttle.js')

const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    newApoint:{
        type:Boolean,
        value:false
    },
    mask:{
      type:Boolean,
      value:false
    },
    dataid:{
      type:Object,
      value:{}
    },
    user:{
        type:Object,
        value:{}
    },
    info:{
        type:Object,
        value:{}
    },
   cid:{
        type:Number,
        value:null
   },
   address:{
        type:Array,
        value:[]
   },
  checkAll:{
        type:Boolean,
        value:false
  },
  shareHome:{
        type:Boolean,
        value:false
  },
  isOver:{
        type:Boolean,
        value:false
  },
    invterUserId:{ //通过分享进来的userID
      type:String,
      value:''
    },
    newuserNamescofs:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    height:wx.getSystemInfoSync().windowHeight,
    itemList:[],
    infoHeight:295,
    ids:[],
    addressList:[],
    index:'',
    canUse:true,
    changeAll:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //全选按钮
    checkboxChangeAll:function(e){
      console.log(e,"1122")
      var arrs = e.currentTarget.dataset.val;
      var leng = arrs.length;
   
      var VALUECHANGEALL = e.detail.value;
      var arrList = [];

      if(VALUECHANGEALL.length==0){
        this.setData({
          changeAll: false
        })
        this.setData({
          ids: arrList
        })
      }else{
        for (var i = 0; i < leng;i++){
          arrList.push(i)
        }
        console.log(arrList,"1")
        this.setData({
          changeAll:true,
          ids: arrList
        })
      }

    },
    //选中
    checkboxChange(e) {
      this.setData({
        ids: e.detail.value
      })
      console.log(this.data.itemList,"itemList")
    },
      hidePage(data){
          this.triggerEvent('hideRow',{data},{});
      },
    //调起用户授权 ****
    // getUser: function (e) {
    //   let that = this;
    //   console.log(e,"aaaa")
    //   if (e.detail.errMsg == "getUserInfo:ok") {

    //     var name = e.detail.userInfo.nickName;

    //     var avatarUrl = e.detail.userInfo.avatarUrl;

    //     wx.setStorageSync('avatarUrl', avatarUrl);
    //     wx.setStorageSync('nickName', name);
    //     wx.setStorageSync('encrypted', e.detail);

    //     _login.getToken(that.data.invterUserId, name, avatarUrl).then(res => {
    //       let user = wx.getStorageSync('loginUser');
    //       this.triggerEvent('loginTrue', user)
    //     }) 
    //     this.setData({
    //       'newuserNamescofs.link_name': name
    //     })
    //   } else {
    //     console.log('授权失败');
    //   }
    // },

      //提交数据
    submitData: throttles.throttle(function (e) {  
      let that = this;
      wx.requestSubscribeMessage({
        tmplIds: ['GQBJY2j2kDjxrs0WrdDHDg2pSajjlHm__q4LaZB8sy4'],
        success: (res) => {
          console.log(res,"啊哈哈哈")
          if (res['GQBJY2j2kDjxrs0WrdDHDg2pSajjlHm__q4LaZB8sy4'] === 'accept') {
            wx.showToast({
              title: '订阅成功',
              duration: 1000,
              success(data) {
              }
            })
          }
        }, fail: (res) => {
          console.log(res, '失败')
        }, complete: (res) => {
          if (!this.data.canUse) return false;
          let user = this.data.user;
          let list = this.data.itemList;
          // let formId = e.detail.formId;
          let ids = this.data.ids;
          let id = this.data.cid;
          let addr = this.data.address;
          let index = this.data.index;
          let options = this.data.dataid;
          let share = this.data.shareHome;
          let newApoint = this.data.newApoint;
          let addrid = '';
          let txt = '';
          var userNames = ''
          var userPhone = ''

          if (!newApoint) {
            if (index === '') {
              txt = '未选择乘车点';
              wx.showToast({
                title: txt,
                duration: 1000,
                image: '../../images/jinggao.png'
              });
              return false;
            }
            if (addr.length > 0) {
              addrid = addr[index].id;
            }
            if (ids.length > 0) {
              let temp = '';
              for (let o of ids) {
                if (list[parseInt(o)].enroll_id === 0) {
                  let i = list[parseInt(o)].id;
                  temp += i + ','
                }
              }
              id = temp.substring(0, temp.length - 1);
            } else {
              if (list.length > 0) {
                txt = '未选择项目';
              }
            }
            if (id === '') {
              txt = '未选择项目';
            }

            //本地缓存用户的联系人名字， 联系人手机号  this.data.newuserNamescofs.link_name:选择后的信息
            console.log('本地缓存用户的联系人名字， 联系人手机号L:', user)
            if (user.user_name || user.user_name != '') {

              userNames = this.data.newuserNamescofs.link_name  || user.user_name

              userPhone = this.data.newuserNamescofs.link_mobile || user.mobile

            } else {
              txt = '请获取用户名'
            }

            if (txt) {
              wx.showToast({
                title: txt,
                duration: 1000,
                image: '../../images/jinggao.png'
              });
              return;
            }
            console.log(userNames, userPhone, id, '', addrid, '提交信息');

            _api.allJoinlist(userNames, userPhone, id, '', addrid, res => {
              wx.showToast({
                title: res.data,
                duration: 1000,
                mask: true,
                success: function () {
                  that.setData({
                    canUse: false
                  })

                  setTimeout(() => {
                    wx.navigateTo({
                      url: '/pages/enroll-success/success?share=' + share
                    })
                  }, 1000)
                }
              })
            }, options.base_id)
          }

        }

      })
      
      }),

      //关闭
      close(data){
          this. hidePage(data);
      },

   
      //地点选择
      bindPickerChange(e){
          this.setData({
              index:e.detail.value
          })
      }
  },
  lifetimes: {
      ready(){
          let newApoint = this.data.newApoint;
        if(!newApoint){
            let cid = this.data.cid;
            let base_id = this.data.dataid.base_id;
            let village_id = this.data.dataid.villageId;
            let check = this.data.checkAll;
            let tempids = [];
            let that = this;
            _api.collectPlist(base_id, village_id, (res) => {
                console.log('组件的数据',res);
                let obj = res.data.activityInfoList;
                let temp = [];
                let index = -1;
                let overflow = 0;
                let even  = 0;
                let timestamp = Date.parse(new Date());
                for(let o of obj){
                    for(let i of o.projects){
                        if(timestamp>new Date(i.enroll_end_at.replace(/-/g,'/'))){
                            i.isOver = true;
                        }else{
                            i.isOver = false;
                        }
                        index++;
                        if(check){
                          // console.log(cid, "cid")
                          //   i.check = true;
                          //   tempids.push(index);
                        }else if(cid){
                          console.log(cid, i, "cid1111")
                            if(i.id == cid){
                                i.check = true;
                                tempids.push(index);

                              console.log(tempids, "2222")
                            }
                        }else{
                            i.check = false;
                        }
                        if(i.project_name.length>8){
                            overflow++;
                            if((index+1)%2==0){
                                even++;
                            }
                        }
                    }
                    temp = temp.concat(o.projects);
                }
                let len = temp.length;
                let height = that.data.height;
                if(len>0){
                    let h = 339+(Math.round((len-overflow-even)/2)*44)+(overflow+even)*44;
                    if(h>height*0.9){
                        h = height*0.9;
                    }
                    that.setData({
                        infoHeight:h
                    })
                }
                let addr = that.data.address;
                let temo = [];
                console.log('addr',that.data);
                for(let o of addr){
                    temo.push(o.name);
                }
                that.setData({
                    joinStaus: res.data,
                    itemList: temp,
                    addressList:temo,
                    ids:tempids
                })
              console.log(this.data.itemList,"ids")
            })
        }
      }
  },

})
