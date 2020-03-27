import {Api} from "../../utils/api";
import {Base} from "../../utils/base";
import {login} from '../../utils/login.js';

let _base = new Base();
let _api = new Api();
let _login = new login();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      //项目分类及商品数据
      items:[],
      //项目数据
      projectData:null,
      //左侧选中选项
      chooseItem:0,
      checkId:'',
      isLogin:false,
      height:wx.getSystemInfoSync().screenHeight,
      //商品选择界面的显示
      isShow:true,
      isSearch:false,
      //商品第一属性选择
      chooseFirst:0,
      //商品第二属性选择
      chooseSecond:0,
      //当前选中的商品
      currentGoods:null,
      //购物车数量
      carNum:0,
      //总金额
      money:0,
      //所有选择的商品
      allOfGoods:[],
      //类别id
      cid:null,
      //展示购物车
      isShowCar:true,
      id:null,//分类id
      index:0,//当前所在的选项
      userInfo:null,//用户信息
      remark:null,//运费备注
      checkImg:null,//放大的图片
      animationImg:null,
      ix:false,//是否是iphonex
      pageX:0,//默认
      search:false,//搜索图标
      tempData:null,
      inputData:'',//输入数据
      top:0,//距离顶部的距离
      share_img:'',//分享图片
      showFloatImg:false,//是否展示浮动图标
      options: null,//一级分类信息
      catagoryInfo:null,//当前分类数据
      firstid:null,
      pMoney:null,//实际价格
      permissions:null,//优惠信息
      discount:0,//优惠的价格
      pageIndex:1,//当前分页
      isOver:false,
      totalData:[],//总览的数据
      shopCar:{},//购物车总览
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let id = options.id;
      let self = this;
      let that = this;
      console.log(options)
      if(options.type!==undefined){
          this.setData({showFloatImg:true,options:options})
      }else{
          this.setData({showFloatImg:false,options:options})
      }
      _login.wxLogin2()
      wx.getSetting({
          success(res) {
              console.log('授权状态',res.authSetting)
              if(res.authSetting['scope.userInfo']){
                  let state = wx.getStorageSync('loginStatus');
                  if(!state){
                      _login.getToken().then(res=>{
                          let state = wx.getStorageSync('loginStatus');
                          let user = wx.getStorageSync('loginUser');
                          if(state){
                              that.setData({
                                  isLogin:true,
                                  collectDespoit:user
                              })
                          }else{
                              that.setData({
                                  isLogin:false
                              })
                          }
                      })
                  }else{
                      that.setData({
                          isLogin:true
                      })
                  }
              }else{
                  that.setData({
                      loginData: {
                          show_modal: true,
                          height:wx.getSystemInfoSync().windowHeight
                      },
                  })
              }
          }
      })
    //获取手机信息
      wx.getSystemInfo({
          success: function(res) {
              self.setData({
                  ix:res.model.includes('iPhone X')?true:false
              })
          }
      })
  },
  //结算订单
  submitOrder:function(){
      let data = this.data.allOfGoods;
      let info = this.data.projectData;
      let cid = this.data.cid;
      let id = this.data.id;
      let img = this.data.showFloatImg;
      let pMoney = this.data.pMoney;
      let money = this.data.shopCar;//总金额
      let goods = data!==null?data.filter((val,index,arr)=>{
          return val.productCount>0
      }):[];
      let userInfo = wx.getStorageSync('loginUser');
      console.log('userInfo',userInfo);
      if (userInfo.userAut === undefined || userInfo.userAut === null) {
          wx.showModal({
              title: "",
              content: '您还未成为多让认证业主！',
              showCancel: true,
              confirmText: '立即认证',
              confirmColor: "#E94816",
              success: function (res) {
                  if (res.confirm) {
                      // 认证页面
                      wx.navigateTo({
                          url: '/pages/my/my-member/member-estate-auth/estate-auth-form/estate-auth-form'
                      })
                      return false
                  } else if (res.cancel) {
                      console.log('用户点击取消')
                      return false
                  }
              }
          })
      }else if(userInfo.userAut.status == 0){
          wx.showToast({
              title: '认证审核中',
              image: '../../images/jinggao.png',
              duration: 1000,
              success:function(){
                  wx.navigateTo({
                      url: '/pages/my/my-member/member-estate-auth/auth-form-res/auth-form-res?commitSuccess=1'
                  })
              }
          })
      }else{
          if(goods.length===0){
              wx.showToast({
                  title: '未选择商品',
                  image: '../../images/jinggao.png',
                  duration: 1000
              })
              return;
          }
        console.log('money',money);
        let url = `../earnest/earnest?prod_price=${money.payTotal}
        &project_name=${info.project_name}
        &project_id=${cid}
        &pay_price=${money.amount}
        &remark=${this.data.remark}
        &mprod_price=${money.payTotal}
        &id=${id}`;
          for(let i=0;i<goods.length;i++){
              url += `&l${i}=${JSON.stringify(goods[i])}`
          }
          if(img){
              wx.navigateTo({
                url: url
              })
          }else{
              wx.redirectTo({
                  url: url
              })
          }
      }
  },
  wxLogin(e){
        let that = this;
        let encrydata = e.detail.encryptedData;
        let options = this.data.options;
        let iv = e.detail.iv;
        if(e.detail.errMsg === "getPhoneNumber:ok") {
            _api.wxLogin({data:encrydata,iv:iv},res=>{
                console.log('res',res);
                if(res.resultCode===1000){
                    wx.setStorageSync("loginStatus", res.data.loginstatus);
                    wx.setStorageSync("loginUser", res.data.loginUser);
                    wx.redirectTo({
                        url:`./detail?id=${options.id}&dataid=${options.dataid}`
                    })
                }
            })
        }else{
            this.setData({
                show:true
            })
            setTimeout(()=>{
                this.setData({
                    masks:true
                })
            },10)
        }
    },
  //商品数量加减
  chooseNum:function(e){
    console.log(e);
    let index = e.currentTarget.dataset.idx;
    let type = e.currentTarget.dataset.type;
    let id = e.currentTarget.id;
    if(type === 'page'){
        console.log(type);
        this.shopPage(index,id);
    }else{
        this.shopCarss(index,id);
    }
  },
  //购物车
  shopCarss(index,type){
      let that = this;
      let all = this.data.allOfGoods;
      let catagory = this.data.catagoryInfo;
      let idx = catagory.findIndex(val=>val.id === all[index].productId);
      let goods = all[index];
      let d = {
          projectId:this.data.options.dataid
      }
      if(type === 'add'){
        d.product = {
            productId:goods.productId,
            productCount:1
        }
        if(idx !== -1)catagory[idx].count +=1
      } else{
          d.product = {
              productId:goods.productId,
              productCount:-1
          }
          if(idx !== -1) catagory[idx].count -=1;
      }
      _api.updateShopCar(d,res=>{
          if(res && res.proList.length>0){
              let temp = _base.reChangeData(res.proList);
              res.count = temp[0].count;
              that.setData({
                  allOfGoods:temp,
                  shopCar:res,
                  catagoryInfo:catagory
              })
          }else{
              res = {
                  count:0,
                  amount:0
              }
              that.setData({
                  allOfGoods:[],
                  shopCar:res,
                  isShow:true,
                  catagoryInfo:catagory
              })
          }
      })
  },
  //商品页面
  shopPage(index,type){
      console.log('type',type);
      let user = this.data.userInfo
      let that = this;
      let catagory = this.data.catagoryInfo;
      let all = this.data.allOfGoods;
      all = all?all:[];
      let goods = catagory[index];
      let d = {
          projectId:goods.projectId
      }
      if(all && all.length>0){
          let idx = all.findIndex((val)=>val.productId === goods.id);
          if(idx !== -1){
             if(type === 'add'){
                 all[idx].productCount += 1;
                 catagory[index].count +=1;
                 d.product = {
                     productId:goods.id,
                     productCount:1
                 }
             }else{
                 if(all[idx].productCount>0){
                     all[idx].productCount -= 1;
                     catagory[index].count -=1;
                     d.product = {
                         productId:goods.id,
                         productCount:-1
                     }
                 }
             }
             if(all[idx].productCount <= 0){
                 all = _base.remove(true,all,idx);
             }
          }else{
              all.push(goods);
              catagory[index].count = 1;
              d.product = {
                  productId:goods.id,
                  productCount:1
              }
          }
      }else if(all && all.length === 0){
        all.push(goods);
        catagory[index].count = 1;
        d.product = {
          productId:goods.id,
          productCount:1
        }
      }
      _api.updateShopCar(d,res=>{
          if(user){
              if(res && res.proList.length>0){
                  let temp =  _base.reChangeData(res.proList);
                  res.count = temp[0].count;
                  that.setData({
                      allOfGoods:temp,
                      currentIndex:index,
                      catagoryInfo:catagory,
                      shopCar:res
                  })
              }else{
                  res = {
                      count:0,
                      amount:0
                  }
                  that.setData({
                      allOfGoods:[],
                      currentIndex:index,
                      catagoryInfo:catagory,
                      shopCar:res,
                  })
              }
          }
      })
  },
  //价格数量
  shopPrice(){
      let that = this;
      let options = this.data.options;
      let user = this.data.userInfo;
      console.log("options",options);
      let data = {
          projectId:options.dataid
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
                  isShow:true
              })
          }

          console.log('temp',that.data.allOfGoods)
      })
  },
  hideModal:function(e){
      let that = this;
      let isShowCar = this.data.isShowCar
        if(this.data.checkImg !== null){
            // let animation = wx.createAnimation({
            //     timingFunction: "ease",
            //     duration:500
            // })
            // this.animation = animation;
            // animation.translateY(200).scale(0,0).step();
            // this.setData({animationImg:animation.export()});
            // setTimeout(function(){
                that.setData({isShow:true,checkImg:null})
            //},600)

        }else{
            if(e.detail.y<this.data.height*0.4){
                let animation = wx.createAnimation({
                    timingFunction: "linear",
                    duration:500
                })
                this.animation = animation;
                animation.translateY(400).step();
                this.setData({animationData: animation.export()})
                setTimeout(()=>{
                    this.setData({isShow:true,isShowCar:!isShowCar,})
                },600)
            }
        }
    },
  //添加购物车
  addToCar:function(){
      let all = this.data.allOfGoods;
      let goods = this.data.currentGoods;
      let carNum = this.data.carNum;
      let money = this.data.money;
      if(goods.count==null || goods.count==0) {
          wx.showToast({
              title: '未选择数量',
              image: '../../images/jinggao.png',
              duration: 1000
          })
          return;
      }else{
          all.push(goods);
          carNum = carNum+goods.count;
          money += goods.productSellPrice * goods.count;
      }
      this.setData({
          isShow:true,
          carNum:carNum,
          allOfGoods:all,
          money:money})
    },
    //切换选项
    changeItem:function(e){
      let self = this;
      let index = e.currentTarget.id;
      let id = this.data.options.dataid;
      let goods = wx.getStorageSync(`${this.data.options.dataid}`);
      let isSearch = this.data.isSearch;
      let items = this.data.items;
      if(!isSearch){
          let data = {
              cid:items[index].id,
              pid:id,
              proName:'',
              page:1
          }
          _api.getCatagoryInfo(data,res=>{
              let result = _base.rePlayData(goods,res);
              self.setData({
                  catagoryInfo:result
              })
          })
      }
      this.setData({chooseItem:index,pageIndex:1,isOver:false});
    },
    //选择标签
    changeTag:function(e){
      let idx = e.currentTarget.id;
      let type = e.currentTarget.dataset.type;
      if(type===0){
          this.setData({chooseFirst:idx})
      }else{
          this.setData({chooseSecond:idx})
      }
    },
    shopCarData:function(){
      let goods = this.data.allOfGoods;
      console.log('goods',goods);
      if(!goods || goods.length === 0) return;
        let animation = wx.createAnimation({
            timingFunction: "ease",
            duration:500
        })
        this.animation = animation;
        animation.translateY(300).step();
        this.setData({
            isShow:false,isShowCar:false,
            animationData: animation.export()
        })
        setTimeout(()=>{
            animation.translateY(0).step();
            this.setData({
                animationData: animation.export()
            })
        },50)
    },
    //滑动事件
    scrollData:function(e) {
        let index = this.data.pageIndex;
        let idx = this.data.chooseItem;
        let item = this.data.items;
        let info = this.data.catagoryInfo;
        let id = this.data.options.dataid;
        let isOver = this.data.isOver;
        let goods = wx.getStorageSync(`${this.data.options.dataid}`);
        let self = this;
        if (!isOver){
            index++;
            console.log('执行');
            let data = {
                page:index,
                cid:item[idx].id,
                pid:id,
                proName:''
            }
            _api.getCatagoryInfo(data,res=>{
                if(res.length>0){
                    let result = _base.rePlayData(goods,res);
                    info = info.concat(result);
                    self.setData({
                        catagoryInfo:info,
                        pageIndex:index
                    })
                }else{
                    self.setData({
                        isOver:true,
                        pageIndex:1
                    })
                }
            })
        }
    },
    //清空购物车
    clear:function(){
        let that = this;
        let isShowCar = this.data.isShowCar
        let options = this.data.options;
        let catagory = this.data.catagoryInfo;
        _api.clearShopCar({projectId:options.dataid},res=>{
            for(let o of catagory){
                o.count = 0;
            }
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
                    isShow:true,
                    isShowCar:!isShowCar,
                    shopCar:car,
                    catagoryInfo:catagory,
                    allOfGoods:[]})
            },600)
        })
    },
    switchItem:function(e){
      this.setData({index:e.detail.current})
    },
    //放大图片
    showImg:function(e){
      let id = e.currentTarget.id;
      console.log(e);
      if(id=='') return;
      let animation = wx.createAnimation({
          timingFunction:'ease',
          duration:300
      })
      this.animation = animation;
      animation.scale(0,0).step();
      this.setData({
          isShow:false,
          checkImg:id,
          animationImg:animation.export()
      })
      setTimeout(()=>{
          animation.scale(1,1).step();
          this.setData({
              animationImg:animation.export()
          })
      },50)
    },
    //搜索图标
    hideImg:function(e){
        this.setData({
            search:false
        })
    },
    //搜索数据展示
    showData:function(e){
      let that = this;
      let txt = e.detail.value;
      let index  = this.data.pageIndex;
      let options = this.data.options;
      if(txt === ''){
          //搜索全部
          let copnfigAll = {
              parentId:this.data.id,
              id:options.dataid,
              type:1,
              index:index
          }
          _api.getClassfication(copnfigAll,res =>{
              if(res){
                  let data = res.data;
                  let index = _base.getIndex(data);
                  let config = {
                      cid:data[index].id,
                      pid:options.dataid,
                      page:index,
                      proName:''
                  }
                  _api.getCatagoryInfo(config,res=>{
                      that.setData({
                          catagoryInfo:res,
                          items:data,
                          chooseItem:index,
                          isSearch:false,
                          isOver:false,
                          pageIndex:1
                      })
                  })
              }
          })
      }else{
          //单个搜索
          let config = {
              parentId:this.data.id,
              id:this.data.cid,
              type:2,
              index:index,
              txt:txt
          }
          _api.getClassfication(config,res=>{
              let data = res.data;
              let index = data.findIndex((val,idx)=> val.pntProductList?val.pntProductList.length>0:-1);
              if(index === -1){
                  that.setData({catagoryInfo:[],items:[],chooseItem:0})
              }else {
                  that.setData({
                      catagoryInfo:data[index].pntProductList,
                      chooseItem:index,
                      items:data,
                      isSearch:true,
                      isOver:false,
                      pageIndex:1
                  })
              }
          });
      }
    },
    //调起用户授权
    getUser: function(e) {
        let that = this;
        console.log("用户授权信息");
        if (e.detail.errMsg == "getUserInfo:ok") {
            wx.setStorageSync('avatarUrl', e.detail.userInfo.avatarUrl);
            wx.setStorageSync('nickName', e.detail.userInfo.nickName);
            wx.setStorageSync('encrypted', e.detail);
            that.setData({
                loginData: {
                    show_modal: false,
                    height:wx.getSystemInfoSync().windowHeight
                },
            })
            _login.getToken().then(res=>{
                let state = wx.getStorageSync('loginStatus');
                let user = wx.getStorageSync('loginUser');
                if(state){
                    that.setData({
                        isLogin:true,
                        collectDespoit:user
                    })
                }else{
                    that.setData({
                        isLogin:false
                    })
                }
            })
        }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        let img = this.data.share_img;
        let data = this.data.projectData;
        let id = this.data.id;
        let cid = this.data.cid;
        let obj = {
            title: `实体店买${data.project_name}，想省钱，找多让代购`,
            img:img,
            desc: '买手严选 正品保障 大牌低价',
            url: `pages/agentDetail/detail?id=${id}&dataid=${cid}&type=1`
        }
        return _base.shareData(obj);
    },
    showItem:function(e) {
        let id = e.currentTarget.id;
        if (id == '') {
            id = e.detail.current;
        }
        this.setData({index:id});
    },
    showSearchImg:function(){
        this.setData({search:true})
    },
    //清除所有
    close:function(){
        this.setData({inputData:''})
        this.showData({detail:{value:''}});
    },
    toHome:function(){
        wx.reLaunch({
            url: '/pages/group/group?village_id=22'
        })
    },
    //获取数据

    getData:function(){
        let self =this;
        let that = this;
        let options = this.data.options;
        let index = this.data.pageIndex;
        let totalData = this.data.totalData;
        let id = options.id;
        let goods = this.data.allOfGoods;
        let userInfo = wx.getStorageSync('loginUser');
            //获取项目信息
            _api.getProjectInfo(options.dataid,res2 =>{
                if(res2){
                    wx.setNavigationBarTitle({
                        title: res2.data.project_name
                    })
                    //获取项目分类信息
                    let config = {
                        parentId:id,
                        id:options.dataid,
                        type:1,
                        index:index
                    }
                    _api.getClassfication(config,res =>{
                        if(res){
                            let data = res.data;
                            let index  = _base.getIndex(data);
                            let config = {
                                cid:data[index].id,
                                pid:options.dataid,
                                page:1,
                                proName:''
                            }
                            _api.getCatagoryInfo(config,res=>{
                                let result = _base.rePlayData(goods,res);
                                let obj = {};
                                obj[`${index}`] = result;
                                totalData.push(obj);
                                self.setData({
                                    catagoryInfo:result,
                                    items:data,
                                    chooseItem:index,
                                    id:id,
                                    totalData:totalData,
                                    firstid:data[index].id,
                                })
                            })
                        }
                    })
                    self.setData({
                        projectData:res2.data,
                        cid:options.dataid,
                        remark:res2.data.remark,
                        share_img:res2.data.share_img,
                        permissions:res2.data.promotions,
                    })
                }
            })
            self.setData({
               chooseContactBack:userInfo?userInfo.userLinkDTO?userInfo.userLinkDTO[0]:{}:{},
                chooseAddressBack:userInfo?userInfo.userReceiveInfoDTO?userInfo.userReceiveInfoDTO[0]:{}:{},
                userInfo:userInfo
            })
    },
    showOnce:function(){
        var that = this;
        that.getData();
        this.setData({
            appointTap: false
        })
    },
    //生命周期
    onShow:function(){
        let that = this;
        console.log('sssssonlshow');
        that.shopPrice();
        that.showOnce();
    }
})
