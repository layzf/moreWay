
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
      soItemId:'',
      type:'',
      dataList:[],
      mask:false,
      show:false,
      img:''
  },
  //获取个人评价
  getOrderData(){
    let id = this.data.soItemId;
    let list = this.data.dataList;
    let d = {
        soItemId:id
    }
    _api.getOrderEvalute(d,res=>{
      console.log('res',res);
        let score = '../../images/';
        if(res.score == 5){
            score += 'icon_comment_verygreat@2x_selected.png';
        }else if(res.score == 3){
            score += 'icon_comment_great@2x_selected.png';
        }else{
            score += 'icon_comment_ungreat@2x_selected.png';
        }
        let img = [];
        if(res.imgUrl){
            let imgs = res.imgUrl.split(';');
            for(let i of imgs){
                img.push(i);
            }
        }
        res.imgList = img;
        res.scores = score;
        res.create_at = res.createAt;
        let temp = res.label;
        if(temp){
            temp = temp.substring(0,temp.length-1);
            let labels = temp.split(';');
            res.label = labels;
        }else{
            res.label = [];
        }
        list.push(res);
      this.setData({
          dataList:list
      })
    })
  },

    //展示图片
    showImg(e){
      console.log('eee',e);
        let index = e.currentTarget.dataset.index;
        let idx = e.currentTarget.dataset.idx;
        let data = this.data.dataList;
        let img = [];
        let imgs;
        console.log(idx,data);
        if(this.data.type){
            imgs = data[idx].img_url.split(';');
        }else{
            imgs = data[idx].imgUrl.split(';');
        }
        for(let i of imgs){
            img.push(i);
        }
        let timg = imgs[index];
        this.setData({
            img:timg,
            show:true
        })
        setTimeout(()=>{
            this.setData({
                mask:true
            })
        },50)
    },

  //获取项目评价
  getShopEvalute(){
    let d ={
        evalute_type:this.data.type,
        ref_id:this.data.soItemId
    }
    _api.getShopEvalute(d,res=>{
      console.log('res',res);
      for(let o of res){
          let score = '../../images/';
          if(o.score == 5){
            score += 'icon_comment_verygreat@2x_selected.png';
          }else if(o.score == 3){
            score += 'icon_comment_great@2x_selected.png';
          }else{
            score += 'icon_comment_ungreat@2x_selected.png';
          }
          let img = [];
          if(o.img_url){
              let imgs = o.img_url.split(';');
              for(let i of imgs){
                  img.push(i);
              }
          }
          o.imgList = img;
          o.scores = score;
          let temp = o.label;
          if(temp){
              temp = temp.substring(0,temp.length-1);
              let labels = temp.split(';');
              o.label = labels;
          }else{
              o.label = [];
          }
      }
      this.setData({
          dataList:res
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          soItemId:options.id,
          type:options.type
      })
      if(options.type){
          this.getShopEvalute();
      }else{
          this.getOrderData();
      }
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

  }
})
