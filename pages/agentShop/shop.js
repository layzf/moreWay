  const app = getApp();
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
    itemList:[],
    checkIndex:0,//默认选中
    showChoose: false,//商品属性选择
    cmask: false,
    height:0,//屏幕高度
    option:'',
    pageIndex:1,//分页
    num:1,
    viewId:'view3',
    allOfGoods:[],
    shopCar:'',
    userInfo:'',
    isShow:true,
    isSearch:false,
    isOver:false,
    windowHeight:0,
    isLogin:false,
    shareHome:false,
    promotions:'',
    catagoryInfo:null,
    user:'',
    copy_write:'',
    share_img: '',
    userId:''

  },


   //选择选项
  chooseItem(e){
    let index = e.currentTarget.dataset.index;
    let self = this;
    if(index>3){
        this.setData({
            viewId:'view'+index
        })
    }
   let id = this.data.option.id;
   let isSearch = this.data.isSearch;
   let items = this.data.itemList;
   if(!isSearch){
      let data = {
          cid:items[index].id,
          pid:id,
          proName:'',
          page:1
      }
      _api.getCatagoryInfo(data,res=>{
          self.setData({
              catagoryInfo:_base.splitData(res)
          })
          console.log('catagoryInfo',this.data.catagoryInfo);
      })
   }else{
       let data = this.data.itemList[index];
       this.setData({
           catagoryInfo:_base.splitData(data)
       })
   }
   this.setData({checkIndex:index,pageIndex:1,isOver:false});
  },
    //搜索数据展示
    showData:function(e){
        let that = this;
        let txt = e.detail.value;
        let index  = this.data.pageIndex;
        let options = this.data.option;
        if(txt === ''){
            //搜索全部
            let copnfigAll = {
                parentId:options.cid,
                id:options.id,
                type:1,
                index:index
            }
            _api.getClassfication(copnfigAll,res =>{
                if(res){
                    let data = res.data;
                    let index = _base.getIndex(data);
                    let config = {
                        cid:data[index].id,
                        pid:options.id,
                        page:index,
                        proName:''
                    }
                    _api.getCatagoryInfo(config,res=>{
                        that.setData({
                            catagoryInfo:_base.splitData(res),
                            itemList:data,
                            checkIndex:index,
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
                parentId:options.cid,
                id:options.id,
                type:2,
                index:index,
                txt:txt
            }
            _api.getClassfication(config,res=>{
                console.log('搜索',res);
                let data = res.data;
                let index = [];
                console.log('data',data);
                data = data.filter((val)=> {return val.pntProductList.length>0});
                if(index === null){
                    that.setData({catagoryInfo:[],items:[],chooseItem:0})
                }else {
                    let t = data[0].pntProductList;
                    that.setData({
                        catagoryInfo:_base.splitData(t),
                        checkIndex:0,
                        itemList:data,
                        isSearch:true,
                        isOver:false,
                        firstid:data[0].id,
                        pageIndex:1
                    })
                }
            });
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

    //购物车
    shopCarss(index,type){
        let that = this;
        let all = this.data.allOfGoods;
        let goods = all[index];
        let d = {
            projectId:this.data.option.id
        }
        if(type === 'add'){
            d.product = {
              productId:goods.productId,
              productCount:1,
              productCode: goods.productCode,
                productSpec:goods.productSpec
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

    returnHome(){
        wx.reLaunch({
            url: '/pages/group/group?village_id=22'
        })
    },

    //价格数量
    shopPrice(){
        let that = this;
        let option = this.data.option;
        let data = {
            projectId:option.id,
            url:`pages/agentShop/shop?id=${option.id}&cid=${option.cid}&txt=${option.txt}`
        }
        _api.getShopCar(data,res=>{
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
            let h = wx.getSystemInfoSync().windowHeight;
            let height = h;
            if(res.count > 0){
                h = h-150;
                console.log('hhh',h);
            }else{
                h = h-72;
            }
            that.setData({
                height:h,
                windowHeight:height
            })
            console.log('h',h)
        })
    },
    //展示商品详情
    showDesc(e){
        let id = e.currentTarget.id;
        let promotions = this.data.promotions;
        console.log('option',this.data.option);
        wx.navigateTo({
          url: '../shopDetail/shop?id='+id+'&pid='+this.data.option.id+'&data='+JSON.stringify(promotions)+'&txt='+this.data.option.txt+'&auth='+this.data.option.auth+'&percent='+this.data.option.percent+'&ptype='+this.data.option.ptype
        })
    },
  //商品数据
  getData:function(){
      console.log("执行getData");
        let self =this;
        let options = this.data.option;
        let index = this.data.pageIndex;
        let id = options.id;
        let goods = this.data.allOfGoods;
        let userInfo = wx.getStorageSync('loginUser');
        //获取项目信息
        _api.getProjectInfo(options.id,res2 =>{
            let data = res2.data;
            let temp = data.freightTemplate;
            let txt = '';
            if(temp){
                let favorable = temp.freightTemplateDetailList;
                if(temp.feeType>1){
                    for(let o of favorable){
                        if(temp.priceType === 1){
                            txt += `在${o.firstNumber}元以内,运费${o.firstAmount}元; `;
                        }else{
                            txt += `在${o.firstNumber}件以内,运费${o.firstAmount}元; `;
                        }
                    }
                }else{
                    txt = '该商品包邮'
                }
            }
            options.cid = data.categoryId;
            options.txt = txt;
            options.auth = data.authNeed;
            options.percent = data.return_value;
            options.ptype = data.return_type;
            if(res2){
                wx.setNavigationBarTitle({
                    title: res2.data.project_name
                })
                //获取项目分类信息
                let config = {
                    parentId:options.cid,
                    id:options.id,
                    type:1,
                    index:index,
                }
                _api.getClassfication(config,res =>{
                    if(res.data.length!==0){
                        let data = res.data;
                        data  = _base.removeData(data);
                        let config = {
                            cid:data[0].id,
                            pid:options.id,
                            page:1,
                            proName:''
                        }
                        _api.getCatagoryInfo(config,res=>{
                          console.log(res,"Asds")
                            let result = _base.rePlayData(goods,res);
                            self.setData({
                                catagoryInfo:_base.splitData(result),
                              // catagoryInfo:res,
                                itemList:data,
                                chooseItem:0,
                                checkIndex:0,
                                id:id,
                                option:options,
                                firstid:data[0].id,
                                promotions:res2.data.promotions
                            })
                          console.log(this.data.catagoryInfo,"catagoryInfo")
                        })
                    }
                })
                self.setData({
                    projectData:res2.data,
                    cid:options.cid,
                    remark:res2.data.remark,
                    share_img:res2.data.share_img,
                    permissions:res2.data.promotions,
                  copy_write: res2.data.copy_write
                })
            }
        })
        self.setData({
            chooseContactBack:userInfo?userInfo.userLinkDTO?userInfo.userLinkDTO[0]:{}:{},
            // chooseAddressBack: userInfo ? userInfo.userReceiveInfoDTO ? userInfo.userReceiveInfoDTO[0] : {} : {},
            userInfo:userInfo
        })
    },
    //清空购物车
    clear:function(){
        let that = this;
        let options = this.data.option;
        let catagory = this.data.catagoryInfo;
        _api.clearShopCar({projectId:options.id},res=>{
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
                    shopCar:car,
                    allOfGoods:[]})
            },600)
        })
    },
    hideModal:function(e){
        if(e.detail.y<this.data.windowHeight*0.4){
            let animation = wx.createAnimation({
                timingFunction: "linear",
                duration:500
            })
            this.animation = animation;
            animation.translateY(400).step();
            this.setData({animationData: animation.export()})
            setTimeout(()=>{
                this.setData({isShow:true})
            },600)
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
            isShow:false,
            animationData: animation.export()
        })
        setTimeout(()=>{
            animation.translateY(0).step();
            this.setData({
                animationData: animation.export()
            })
        },50)
    },
  //加载数据
  loadMore(){
      if(this.data.isSearch){
          return false;
      }
      wx.showLoading({title:'加载中'})
      let index = this.data.pageIndex;
      let idx = this.data.checkIndex;
      let item = this.data.itemList;
      let info = this.data.catagoryInfo;
      let id = this.data.option.id;
      let isOver = this.data.isOver;
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
              wx.hideLoading();
              if(res.length>0){
                  let t = info.data.concat(res);
                  self.setData({
                      catagoryInfo:_base.splitData(t),
                      pageIndex:index
                  })
              }else{
                  wx.showToast({
                    title: '没有更多了'
                  })
                  self.setData({
                      isOver:true,
                      pageIndex:1
                  })
              }
          })
      }else{
          wx.hideLoading();
      }
  },

    //结算订单
    submitOrder:function(){
        let data = this.data.allOfGoods;
        let car = this.data.shopCar;//总金额
        let user = this.data.user;
        let auth = this.data.option.auth;
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
        &project_id=${car.projectId }
        &pay_price=${car.amount}
        &auth=${this.data.option.auth}
        &remark=''
        &mprod_price=${car.promotion}
        &freight=${car.freightFee}`;
      console.log(this.data.allOfGoods, car,"allOfGoods")
        for(let i=0;i<data.length;i++){
            url += `&l${i}=${JSON.stringify(data[i])}`
        }
        wx.navigateTo({
            url: url
        })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (options.userId) {
      this.setData({
        userId: options.userId
      })
    }
    if(options.type){
        this.setData({
            shareHome:true
        })
    }
    this.setData({
        option:options
    })
    if (options.scene) {
      var code = decodeURIComponent(options.scene);
      this.setData({
        'option.id': code
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

      let option = this.data.option;
      if(option.search){
          this.showData({detail:{value:option.search}})
      }else{
          console.log('this.data.isSearch',this.data.isOver);
          if(!this.data.isOver){
              this.getData();
          }
      }
      this.shopPrice();
      this.getPersonInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      this.shopPrice();
  },


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
      var loginUserId = wx.getStorageSync('loginUser');

      console.log(`%c 阿文提醒您：商品列表分享者ID为：${loginUserId.id}`, `color:#f00;font-weight:bold;`)
        let img = this.data.share_img;
        let data = this.data.projectData;
        let option = this.data.option;
        let obj = {
            title: this.data.copy_write,
            img:img,
            desc: '买手严选 正品保障 大牌低价',
          url: `pages/agentShop/shop?id=${option.id}&cid=${option.cid}&type=1&txt=${option.txt}&userId=${loginUserId.id}`
         }
        return _base.shareData(obj);
    },
})
