import {
    Base
} from '../../utils/base.js';
import {
    Api
} from '../../utils/api.js';
import {
  login
} from '../../utils/login.js';

var _base = new Base();
var _api = new Api();
var _login = new login();

const throttles = require('../../utils/throttle.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:wx.getSystemInfoSync().screenHeight,
    info:{},//项目信息
    items:[],//商品信息
    chooseContactBack:{},
    chooseAddressBack:{},
    //展示更多
    showMore:false,
    userInfo:null,

    disabled:false,
    //判断是否授权
    loginscofUser:false,
    scopeUserInfo:'',//授权后用户信息
  },
  onLoad(options){
  let that = this;

  let data = Object.entries(options);

  let temp = [];
  for (let o of data) {
    if (o[0].includes('l')) {
      temp.push(JSON.parse(o[1]))
    }
  }
  this.setData({ items: temp, info: options });
  
  _api.diffState(res => {
    let userInfo = res.data.userInfo;
    var linkDTO = userInfo.userLinkDTO;
    var recDTO = userInfo.userReceiveInfoDTO;

    that.setData({
      chooseAddressBack: recDTO[recDTO.length-1]
    })

    for (var i of linkDTO) {
      if (i.is_default === 1) {
        that.setData({
          chooseContactBack: i
        })
      }
    }
    for (let o of recDTO) {
      if (o.is_default == 1) {
        that.setData({
          chooseAddressBack: o
        })
      }
    }

  })
},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    let user = wx.getStorageSync('loginUser');//是否有授权后的名字

    //没有名字弹出 授权弹框
    if (!user.user_name) {
      _base.showToast('未授权', 'none', 1200, wx.navigateTo({
        url: '../newLogin/index',
      }))
    } 
    //名字不为空，并且选择联系人 为空的时候
    console.log(currPage,"currPage.data.chooseAddressBack")
    if (user.user_name && !currPage.data.chooseContactBack.link_name) {
      this.setData({
        'chooseContactBack.link_name': user.user_name,
      })
    }

    if (currPage.data.chooseContactBack) {
      this.setData({
        chooseContactBack: currPage.data.chooseContactBack
      });
    }
    if (currPage.data.chooseAddresBack) {
      this.setData({
        chooseAddressBack: currPage.data.chooseAddressBack
      });
    } 
  },


  //去项目详情
  // toDesc:function(){
  //   let id = this.data.info.project_id;
  //   let cid = this.data.info.id;
  //   wx.navigateTo({
  //     url: '../agentDetail/detail?id='+cid+'&dataid='+id
  //   })
  // },
  
  //选择联系人
  chooseLink:function(){
    wx.navigateTo({
      url: '../my/my-contact/contact-list/contact-list?type=order'
    })
  },
  //查看更多
  showMoreData:function(){
    this.setData({showMore:true})
  },

    //地址选择
    chooseAddress(){
      wx.navigateTo({
        url: '../my/my-address/address-list/address-list'
      })
    },
  //提交订单
  submitOrder: throttles.throttle(function (e) {
    if( this.data.chooseAddressBack == undefined){
        wx.showToast({
            title:'请选择地址',
            icon: 'none'
        })
        return ;
    }
     if (this.data.chooseContactBack.link_name == '') {
          wx.showToast({
            title: '请选择联系人',
            icon:'none'
          })
          return;
        }

              let info = this.data.info;
              let items = this.data.items;
              let u_id=  this.data.chooseContactBack.id;
              let r_id = this.data.chooseAddressBack.id;
              let temp = [];
              console.log('r_id',r_id);
              for(let o of items){
                  console.log('0',o);
                let obj = {};
                obj.productId = o.id;
                obj.prodCount = o.productCount;
                obj.prodName = o.pntName.trim();
                obj.prodPrice = o.pntPrice;
                temp.push(obj);
              }
              console.log('info',info);
              let data = {
                  prod_price:info.prod_price,
                  project_name:info.project_name.trim(),
                  project_id:info.project_id.trim(),
                  pay_price:info.pay_price,
                  user_receive_id:r_id,
                  user_link_id:u_id,
                  soItemDetailList:temp
              }
              console.log(data,"Aaa")
              _api.submitOrder(data,resp=>{
                    if(resp.data){
                        console.log('id',info.project_id);
                        wx.setStorage({key: `${info.project_id}`.trim(), data: null})

                      _api.pay_data(resp.data, res => {
                        console.log(resp.data,"支付中的id")
                        wx.requestPayment({
                          'timeStamp': "" + res.data.timeStamp,
                          'nonceStr': res.data.nonceStr,
                          'package': "prepay_id=" + res.data.prepay_id,
                          'signType': res.data.signType,
                          'paySign': res.data.paySign,
                          'success': function (res) {
                            if (res.errMsg == 'requestPayment:ok') {
                              wx.redirectTo({
                                url: '/pages/earnest/pay-result/result?payorder=1&payid=' + resp.data +''
                              })
                            } else {
                              console.log('支付失败');
                            }
                          },
                          'fail': function (res) {
                            wx.showToast({
                              title: '支付失败',
                              duration: 2000,
                              success: function () {
                                setTimeout(() => {
                                  wx.redirectTo({
                                    url: '../my/my-order/order-list/order-list?type=6'
                                  })
                                }, 1000)
                              }
                            })
                          }
                        })
                      })
                    }
                })

  }, 1000),


})
