import { Base } from '../../utils/base.js';
import { Api } from '../../utils/api.js';
import { login } from '../../utils/login.js';
var _base = new Base();
var _api = new Api();
var _login = new login();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageData:'',
    option:'',
    allOfGoods:[],
    shopCar:'',
    isShow:true,
    promotions:'',
    shareHome:false,
    user:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let d = {
      id:options.id,
      url:'pages/onlineOrder/online?id='+options.id
    }
    let h = wx.getSystemInfoSync().windowHeight;
    if(options.type) this.setData({shareHome:true})
    this.setData({
        option:options,
        windowHeight:h
    })
    _api.toSubscription(d,res=>{
      console.log('res',res.data);
      let data = res.data;
      let temp = res.data.freightTemplate;
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
      console.log('pageData',data);
      that.setData({
          pageData:data,
          promotions:res.data.promotions,
          txt:txt
      })
      wx.setNavigationBarTitle({
        title: data.project_name
      })
    })
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


    //结算订单
    submitOrder:function(){
        let data = this.data.allOfGoods;
        let car = this.data.shopCar;//总金额
        let user = this.data.user;
        let auth = this.data.pageData.authNeed;
        console.log('auth',auth,'user',user);
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
        &remark=''
        &type=${this.data.pageData.return_type}
        &mprod_price=${car.promotion}
        &freight=${car.freightFee}`;
        for(let i=0;i<data.length;i++){
            url += `&l${i}=${JSON.stringify(data[i])}`
        }
        wx.navigateTo({
            url: url
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
            this.setData({isShow:true})
        },600)
    },

    //清空购物车
    clear:function(){
        let that = this;
        let options = this.data.option;
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

 search(e){
      let val = e.detail.value;
     let cid = this.data.pageData.categoryId;
     let id = this.data.option.id;
     wx.navigateTo({
         url: '../agentShop/shop?id='+id+'&cid='+cid+'&search='+val+'&txt='+this.data.txt+'&auth='+this.data.pageData.authNeed+'&ptype='+this.data.pageData.return_type+'&percent='+this.data.pageData.return_value
     })
 },

  toDesc(e){
    let option = this.data.option;
    let id = e.currentTarget.id;
    let promotions = this.data.promotions
    wx.navigateTo({
      url: '../shopDetail/shop?id='+id+'&pid='+option.id+'&data='+JSON.stringify(promotions)+'&txt='+this.data.txt+'&auth='+this.data.pageData.authNeed+'&percent='+this.data.pageData.return_value+'&ptype='+this.data.pageData.return_type
    })
  },
  //价格数量
  shopPrice(){
      let that = this;
      let options = this.data.option;
      console.log("options",options);
      let data = {
          projectId:options.id
      }
      _api.getShopCar(data,res=>{
          if(res && res.proList.length>0){
              let temp = _base.reChangeData(res.proList);
              res.count = temp[0].count;
              console.log('carres',res);
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

  more(){
    let cid = this.data.pageData.categoryId;
  console.log('cid',cid);
    let id = this.data.option.id;
    wx.navigateTo({
      url: '../agentShop/shop?id='+id+'&cid='+cid+'&txt='+this.data.txt+'&auth='+this.data.pageData.authNeed+'&percent='+this.data.pageData.return_value+'&ptype='+this.data.pageData.return_type
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.shopPrice();
    this.getPersonInfo();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
        let id = this.data.options.id;
        let name = this.data.pageData.project_name;
      let obj = {
          title: `${name}，想省钱，找多让`,
          img:img,
          desc: '买手严选 正品保障 大牌低价',
          url: `pages/onlineOrder/online?id=${option.id}&cid=${option.cid}&type=1&txt=`+option.txt
      }
      return _base.shareData(obj);
  }
})
