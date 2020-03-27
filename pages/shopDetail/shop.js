// pages/shopDetail/shop.js
const app = getApp();
import {Api} from "../../utils/api";
import {Base} from "../../utils/base";
import {login} from '../../utils/login.js';

let _base = new Base();
let _api = new Api();
let _login = new login();
Page({
  data: {
    enroll:'',//是否是从报名成功进入，从报名进入 点击底部首页跳转店铺
    pid:'',//店铺Pid
    id:'',//商品id
    dataList:'',
    isShow:false,
    windowHeight:0,
    showChoose:false,
    cmask:false,
    option:'',
    shopCar:'',
    allOfGoods:[],
    shareHome:false,
    isBuy:false,
    animationData:'',
    isAuth:false,
    isLogin:false,
    status:'',
    user:null,
    iPhoneX:false,
    userId:'',
    /**输入手机号登录参数**/
    show:false,
    masks:false,
    isLogin:false,
    collectId:''
  },
  getData(){
    let that = this;
    let id = this.data.id;
    let d = {
        productId:id,
        url:`pages/shopDetail/shop?id=${id}`
    }
    _api.getShopDesc(d,res=>{
      console.log('res',res);
      that.setData({
          dataList:res
      })
      wx.setNavigationBarTitle({
        title: res.productName
      })
    })
  },

    //查看全部
    showAll(){
        let data = this.data.dataList;
        let type = data.evaluateInfo.evaluteType;
        let id = data.id;
        wx.navigateTo({
            url: '../showEvalute/show?id='+id+'&type='+type
        })
    },

    //商品数量加减
    chooseNum:function(e){
        console.log(e);
        let index = e.currentTarget.dataset.idx;
        let type = e.currentTarget.dataset.type;
        let id = e.currentTarget.id;
         console.log(type, "type");

      this.shopCarss(index, id);

        // if(type === 'page'){
        //     this.shopPage(index,id);
        // }else{
        //     this.shopCarss(index,id);
        // }
    },
//手机号授权
    wxLogin(e){
        let that = this;
        let data = e.detail.encryptedData;
        let iv = e.detail.iv;
        if(e.detail.errMsg === "getPhoneNumber:ok") {
            _api.wxLogin({data:data,iv:iv},res=>{
                console.log('res',res);
                wx.setStorageSync("loginStatus", res.data.loginstatus);
                wx.setStorageSync("loginUser", res.data.loginUser);
                if(res.resultCode===1000){
                    if(res.data.loginUser){
                        wx.setStorageSync('isLogin',true);
                        that.setData({
                            isLogin:true
                        })
                        that.addToCar();
                        that.shopPrice();
                        that.getPersonInfo();
                        if(res.data.loginUser.userAuth){
                            wx.setStorageSync('isAuth',true);
                            that.setData({
                                isAuth:true
                            })
                        }
                    }
                } else if (res.resultCode === 1005) {
                  that.setData({
                    isSub: true,
                    show: true
                  })
                  setTimeout(() => {
                    that.setData({
                      masks: true
                    })
                  }, 10)
                }
            })
        } else {
          this.setData({
            isSub: true,
            show: true
          })
          setTimeout(() => {
            this.setData({
              masks: true
            })
          }, 10)
        }
    },
  showLoginData() {
    this.setData({
      isLogin: true,
      showLogin: true
    })
  },
  //隐藏登录(登录成功/点击遮罩)
  hideRowLogin(e) {
    if (e.detail.suc) {
      this.setData({
        isLogin: e.detail.suc,
        masks: false
      })
      this.addToCar();
    }
    setTimeout(() => {
      this.setData({
        show: false
      })
    }, 300)
  },
  //添加进购物车
  addToCar(){
      let data = this.data.dataList;
      let user = this.data.user;
      let auth = this.data.option.auth;
      let that = this;
      let txt = '';
      let urls = '';
      if(user){
          if(user.userAut){
              if(auth == 1){
                  if(user.userAut.status == 0){
                      txt = '认证审核中'
                      urls = '/pages/my/my-member/member-estate-auth/auth-form-res/auth-form-res'
                  }
              }
          }else{
              if(auth == 1){
                  txt = '请先认证';
                  urls = "/pages/my/my-member/member-estate-auth/estate-auth-form/estate-auth-form?village_name=" + this.data.option.village_name + "&village_id=" + this.data.option.village_id
              }
          }
      }else{
          if(auth == 1){
              txt = '请先认证';
              urls = "/pages/my/my-member/member-estate-auth/estate-auth-form/estate-auth-form?village_name=" + this.data.option.village_name + "&village_id=" + this.data.option.village_id
          }
      }
      if(txt){
          wx.showToast({
              title: txt,
              image: '../../images/jinggao.png',
              duration: 1000,
              mask:true
          })
          setTimeout(res=>{
              wx.navigateTo({
                  url: urls
              })
          },1000)
          return;
      }
      if(data.pntAttrKeyList){
          this.setData({
              showChoose:true
          })
          setTimeout(()=>{
              this.setData({
                  cmask:true
              })
          },100)
      }else{
          let p  = {
              productId:data.id,
              productCount:1,
              productCode: data.productCode
          }
          let pro = {
              projectId:data.projectId,
              product:p
          }
          console.log('pro12333',pro);
          _api.updateShopCar(pro,res=>{  
              if(res){
                  wx.showToast({
                      title:'添加成功',
                      duration:1000,
                      success:function(){
                          let temp = _base.reChangeData(res.proList);
                          res.count = temp[0].count;
                          that.setData({
                              shopCar:res,
                              allOfGoods:temp
                          })
                      }
                  })
              }
          })
      }
  },
  //立即购物
  buy(){
      let data = this.data.dataList;
      let that = this;
      if(data.pntAttrKeyList){
          this.setData({
              isBuy:true,
              showChoose:true
          })
          setTimeout(()=>{
              this.setData({
                  cmask:true
              })
          },50)
      }else{
          let p  = {
              productId:data.id,
              productCount:1,
          }
          let pro = {
              projectId:data.projectId,
              product:p
          }
          console.log('pro',pro);
          _api.updateShopCar(pro,res=>{
              console.log('addtoCar',res);
              if(res){
                  wx.showToast({
                      title:'添加成功',
                      duration:1000,
                      success:function(){
                          let temp = _base.reChangeData(res.proList);
                          res.count = temp[0].count;
                          that.setData({
                              shopCar:res,
                              allOfGoods:temp
                          })
                          setTimeout(()=>{
                              that.submitOrder()
                          },100)
                      }
                  })
              }
          })
      }
  },
  //加入购物车后更新本地数据
   changeCar(e){
        let res = e.detail.res;
        console.log('e',res);
        let temp = _base.reChangeData(res.proList);
        res.count = temp[0].count;
        this.setData({
            shopCar:res,
            allOfGoods:temp
        })
    },
    //清空购物车
    clear:function(){
        let that = this;
        let options = this.data.option;
        _api.clearShopCar({projectId:options.pid},res=>{
            let car = {
                amount:0,
                proList:[],
                count:0
            }
            let animation = wx.createAnimation({
                timingFunction: "linear",
                duration:500
            })
            that.animation = animation;
            animation.translateY(400).step();
            that.setData({animationData: animation.export()})
            setTimeout(()=>{
                that.setData({
                    isShow:false,
                    shopCar:car,
                    allOfGoods:[]})
            },600)
        })
    },
    hideModal:function(e){
        let animation = wx.createAnimation({
            timingFunction: "linear",
            duration:500
        })
        this.animation = animation;
        animation.translateY(400).step();
        this.setData({animationData: animation.export()})
        setTimeout(()=>{
            this.setData({isShow:false})
        },600)
    },
    //去项目
    toProject(){
      console.log(this.data.pid,"this.data.pid")
      if (this.data.enroll){
        wx.navigateTo({
          url: '/pages/agentShop/shop?id=' + this.data.pid+'',
        })
      }else{
        wx.reLaunch({
          url: '/pages/group/group?village_id=22'
        })
      }
      
    },
    //购物车数据
    shopCarData:function(){
        let goods = this.data.allOfGoods;
        console.log('goods',goods);
        if(!goods || goods.length === 0) {
            wx.showToast({
                title:'还没选购商品'
            })
            return;
        }
        let animation = wx.createAnimation({
            timingFunction: "ease",
            duration:500
        })
        this.animation = animation;
        animation.translateY(300).step();
        this.setData({
            isShow:true,
            animationData: animation.export()
        })
        console.log('isShow',this.data.isShow);
        setTimeout(()=>{
            animation.translateY(0).step();
            this.setData({
                animationData: animation.export()
            })
        },50)
    },

    //结算订单
    submitOrder:function(){
        let data = this.data.allOfGoods;
        let goods = this.data.dataList;
        let user = this.data.user;
        let auth = this.data.option.auth;
        let car = this.data.shopCar;//总金额
        console.log('user',user);
        let txt = '';
        let urls = '';
        if(user){
            if(user.userAut){
                if(auth == 1){
                    if(user.userAut.status == 0){
                        txt = '认证审核中'
                        urls = '/pages/my/my-member/member-estate-auth/auth-form-res/auth-form-res'
                    }
                }
            }else{
                if(auth == 1){
                    txt = '请先认证';
                    urls = "/pages/my/my-member/member-estate-auth/estate-auth-form/estate-auth-form?village_name=" + this.data.option.village_name + "&village_id=" + this.data.option.village_id
                }
            }
        }else{
            if(auth == 1){
                txt = '请先认证';
                urls = "/pages/my/my-member/member-estate-auth/estate-auth-form/estate-auth-form?village_name=" + this.data.option.village_name + "&village_id=" + this.data.option.village_id
            }
        }
        if(txt){
            wx.showToast({
                title: txt,
                image: '../../images/jinggao.png',
                duration: 1000,
                mask:true
            })
            setTimeout(res=>{
                wx.navigateTo({
                    url: urls
                })
            },1000)
            return;
        }
        if(data.length===0){
            wx.showToast({
                title: '未选择商品',
                image: '../../images/jinggao.png',
                duration: 1000
            })
            return;
        }
        let url = `../earnest/earnest?prod_price=${car.payTotal}
        &project_name=${car.projectName}
        &project_id=${goods.projectId}
        &pay_price=${car.amount}
        &img=${goods.productImage}
        &auth=${this.data.option.auth}
        &mprod_price=${car.promotion}
        &freight=${car.freightFee}`;
            for(let i=0;i<data.length;i++){
                url += `&l${i}=${JSON.stringify(data[i])}`
            }
            wx.redirectTo({
                url: url
            })
    },

    //返回首页
    returnHome(){
        wx.reLaunch({
            url: '/pages/group/group?village_id=22'
        })
    },

    //价格数量
    shopPrice(){
        let that = this;
        let options = this.data.option;
        let data = {
            projectId:options.pid
        }
        _api.getShopCar(data,res=>{
            console.log('carres',res);
            if(res && res.proList.length>0){
                let temp = _base.reChangeData(res.proList);
                res.count = temp[0].count;
                that.setData({
                    shopCar:res,
                    allOfGoods:temp,
                })
            }else{
                res = {
                    count:0,
                    amount:0
                }
                that.setData({
                    shopCar:res,
                    allOfGoods:[],
                    isShow:false
                })
            }
        })
    },

    getPersonInfo(){
     _api.diffState(res=>{
       console.log('person',res);
       let user = res.data.userInfo;
       if(user){
           this.setData({
               isLogin:true,
               user:user
           })
           if(user.userAut){
               if(user.userAut.status == 1){
                   this.setData({
                       isAuth:true
                   })
               }
               this.setData({
                   status:user.userAut.status
               })
           }
       }
     })
    },

    toAuth(){
        let user = this.data.user;
        let auth = this.data.option.auth;
        let type = this.data.option.ptype;
        console.log('user',user);
        let txt = '';
        let url = '';
        if(user){
            if(user.userAut){
                if(auth == 1 || type == 1){
                    if(user.userAut.status == 0){
                        txt = '认证审核中'
                        url = '/pages/my/my-member/member-estate-auth/auth-form-res/auth-form-res'
                    }
                }
            }else{
                if(auth == 1 || type == 1){
                    txt = '请先认证';
                    url = "/pages/my/my-member/member-estate-auth/estate-auth-form/estate-auth-form?village_name=" + this.data.option.village_name + "&village_id=" + this.data.option.village_id
                }
            }
        }else{
            if(auth == 1 || type == 1){
                txt = '请先认证';
                url = "/pages/my/my-member/member-estate-auth/estate-auth-form/estate-auth-form?village_name=" + this.data.option.village_name + "&village_id=" + this.data.option.village_id
            }
        }
        if(txt){
            wx.navigateTo({
                url: url
            })
        }
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,"aaaa")
    let state = wx.getStorageSync('loginStatus');  //****
    let that = this;

    console.log(state,"state")
    if (state){
      _login.wxLogin2(options.userId, res => {
        console.log(res, "res回调用户的ID")
        app.globalData.userId = res
      })
    }
    if (options.userId) {
      this.setData({
        userId: options.userId
      })
    }
    if (options.enroll){ //是否是从报名进入
      this.setData({
        enroll: options.enroll,
        pid : options.pid
      })
    }


    let h = wx.getSystemInfoSync().windowHeight;
    let data = []
    if (options.data){
      data = JSON.parse(options.data);
    }
    let tip = '';
    for(let o of data){
        tip+=`满${o.amount}减${o.rule}; `;
    }
    console.log('options',options);
    if(options.type){
        this.setData({
            shareHome:true
        })
    }
    wx.getSystemInfo({
      success:res=>{
        console.log(`%c 手机型号：${res.model}`, `color:#f00;font-weight:bold;`)
        if (res.model.search('iPhone X') != -1){
          this.setData({
            iPhoneX: true
          })
        }
      }
    })
    this.setData({
        id:options.id,
        windowHeight:h,
        promotions:tip,
        option:options
    })
  },
    //购物车
    shopCarss(index,type){
        let that = this;
        let all = this.data.allOfGoods;
        let goods = all[index];

        console.log(goods,"哈哈哈")
        let d = {
            projectId:this.data.option.pid
        }
        if(type === 'add'){
          
            d.product = {
                productId:goods.productId,
                productCount:1,
                productCode: goods.productCode,
                productSpec: goods.productSpec
            }
        } else{
            d.product = {
                productId:goods.productId,
                productCount:-1,
                productCode: goods.productCode,
                productSpec: goods.productSpec

            }
        }
       
        _api.updateShopCar(d,res=>{
            if(res && res.proList.length>0){
                let temp = _base.reChangeData(res.proList);
                res.count = temp[0].count;
                that.setData({
                    allOfGoods:temp,
                    shopCar:res
                })
            }else{
                res = {
                    count:0,
                    amount:0
                }
                that.setData({
                    allOfGoods:[],
                    shopCar:res,
                    isShow:true
                })
            }
        })
    },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData();
    this.shopPrice();
    this.getPersonInfo();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var loginUserId = wx.getStorageSync('loginUser');
      let data = this.data.option.data;
      console.log('data',data);
      let obj = {
        title: this.data.dataList.productName + this.data.dataList.productCode, 
        url: `pages/shopDetail/shop?id=${this.data.id}&type=1&data=${data}&userId=${loginUserId.id}&auth=${this.data.option.auth}&pid=${this.data.option.pid}`
      }
      return _base.shareData(obj);
  }
})
