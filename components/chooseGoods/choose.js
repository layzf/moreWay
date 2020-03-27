
import {Api} from "../../utils/api";
import {Base} from "../../utils/base";
import {login} from '../../utils/login.js';

let _base = new Base();
let _api = new Api();
let _login = new login();
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentGoods:{
      type:Object,
      value:{
        num:1,
        price:50,
        pntAttrKeyList:[1,2]
      }
    },
    animationData:{
        type:Object,
        value:{}
    },
    showChoose:{
      type:Boolean,
      value:false
    },
    isBuy:{
        type:Boolean,
        value:false
    },
    mask:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    height:0,
    checkIndex:[],
    choose:[],
    chooseId:[],
    newcurrentGoods:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
      //数量
      chooseNum(e){
        let id = e.currentTarget.id;
        let data = this.data.currentGoods;
        let num = data.num;
        if(id === 'add'){
           num += 1;
        }else{
           num -= 1;
        }
        if(num < 1){
          num = 1;
        }
        data.num = num;
        this.setData({
            currentGoods: data
        })
      },
      hidePage(){
          let that = this;
          let height = this.data.height;
          let data = this.data.currentGoods;
          let isBuy = this.data.isBuy;
          let animation = wx.createAnimation({
              timingFunction: "linear",
              duration:500
          })
          data.num = 1;
          that.animation = animation;
          animation.bottom(-(height+238)).step();
          that.setData({animationData: animation.export(),mask:false})
          setTimeout(()=>{
              that.setData({
                  showChoose:false,
                  currentGoods:data
              })
              if(isBuy){
                  console.log('buy');
                  setTimeout(()=>{
                      that.triggerEvent('buy',{},{});
                  },50)
              }
          },300)
      },
      changeTag(e){
        let goods = this.data.currentGoods;
        let check = this.data.checkIndex;
        let chooseId = this.data.chooseId;
        let index = e.currentTarget.dataset.index;
        let aid = e.currentTarget.dataset.id;
        let id = e.currentTarget.id;
        let choose = this.data.choose;
        let len = goods.pntAttrKeyList.length;
        let that = this;
        let s = `${aid}:${id},`;
        let result = choose.includes(aid);
        if(!result){
            choose.push(aid);
        }
        check.push(s);
        check[index] = s;
        chooseId.push(id);
        chooseId[index] = id;
        this.setData({
            checkIndex:check,
            choose:choose,
            chooseId:chooseId
        })
        if(choose.length >= len){
            let str = '';
            let index = 1;
            for(let o of check){
              if(index<= len){
                  str+=o;
              }
              index++;
            }
            str = str.substring(0,str.length-1)
            let d = {
                productId:goods.id,
                productSpec:str
            }
            _api.getAttrPrice(d,res=>{
              console.log(res,"价格")
                goods.productSellPrice = res;
                that.setData({
                    newcurrentGoods:res,
                    currentGoods:goods,
                    checkStr:str,
                    checkIndex:check
                })
            })
        }
      },
      //添加购物车
      addToCar(){
        let that = this;
        let goods = this.data.currentGoods;
        console.log("哈哈哈",goods)
        let str = this.data.checkStr;
        let check = this.data.checkIndex;
        let txt = null;
        if(check.length < goods.pntAttrKeyList.length){
            txt = '请选择属性';
        }else if(goods.num<=0){
            txt = '请选择数量';
        }
        if(txt){
          wx.showToast({
              title:txt
          })
          return false;
        }
        let p  = {
            productId:goods.id,
            productCount:goods.num,
            productCode: goods.productCode,
            productSpec:str
        }
        let pro = {
            projectId:goods.projectId,
            product:p
        }
        console.log('pro',pro);
        _api.updateShopCar(pro,res=>{
   
          if(res){
            that.triggerEvent('changeCar',{res},{});
            wx.showToast({
                title:'添加成功',
                duration:1000
            })
            setTimeout(()=>{
                that.hidePage();
            },1000)
          }
        })
      }
  },
  lifetimes:{
      ready(){
      let that = this;
      let h = wx.getSystemInfoSync().windowHeight
      let goods = this.data.currentGoods;
      goods.num = 1;
      let data = this.data.currentGoods;
      console.log('goods',goods);
      if(data.pntAttrKeyList){
          let len = data.pntAttrKeyList.length;
          let height = len * 64;
          if((height+254)>h*0.9){
              height = 0.9*h - 254;
          }
          this.setData({
              height:height,
              currentGoods:goods
          })
      }
    }
  }
})
