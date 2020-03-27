import {
    Base
} from '../../utils/base.js';
import {
    Api
} from '../../utils/api.js';
import {
    login
} from '../../utils/login.js';
var _login = new login();
var _base = new Base();
var _api = new Api();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      imgList:[],
      imgNum:6,
      checkStatus:null,
      checkLabels:[],
      uploadImgData:[],
      soItemId:'',
      remark:'',
      labels:[
          [{txt:'态度很好',check:false},{txt:'服务很热情',check:false},{txt:'商品质量非常好',check:false},{txt:'发货速度很快',check:false}],
          [{txt:'态度良好',check:false},{txt:'服务较热情',check:false},{txt:'商品质量不错',check:false},{txt:'发货速度较快',check:false}],
          [{txt:'态度较差',check:false},{txt:'服务一般',check:false},{txt:'商品质量一般',check:false},{txt:'发货速度一般',check:false}]
      ]
  },
  //上传文件
  uploadImg(){
      let size = this.data.imgNum;
      let that = this;
      if(size<=0){
        wx.showToast({
            image:'../../images/jinggao.png',
            title:'数量已达上限'
        })
        return false;
      }
      wx.chooseImage({
          count: size,
          sizeType: 'compressed',
          sourceType: ['album', 'camera'],
          success(res) {
              const tempFilePaths = res.tempFilePaths;
              let progress = {success:0,fail:0,index:0,size:tempFilePaths.length};
              that.upLoadImgs(tempFilePaths,progress);
          }
      })
  },

  //上传图片
  upLoadImgs(imgData,progress){
      let img = this.data.imgList;
      let size = this.data.imgNum;
      let uploadImgData = this.data.uploadImgData;
      wx.showLoading({
          title:`正在上传${progress.index+1}/${imgData.length}`
      })
      let that = this;
      let promise =  new Promise((resolve)=> {
          wx.uploadFile({
              url: _base.baseRequestUrl + 'file/upload' + '.json',
              name: 'file',
              filePath: imgData[progress.index],
              success(res) {
                  const data = JSON.parse(res.data);
                  console.log('data',data);
                  if (data.resultCode === 1000) {
                      uploadImgData.push(data.data);
                      img.push(imgData[progress.index]);
                      progress.success += 1;
                      size -= 1;
                      that.setData({
                          imgList: img,
                          imgNum:size,
                          uploadImgData:uploadImgData
                      })
                  } else {
                      progress.fail += 1;
                  }
                  progress.index += 1;
                  resolve(progress)
              }
          })
      })
      promise.then(proData=>{
          if(proData.index < proData.size){
              that.upLoadImgs(imgData,proData);
          }else{
              wx.hideLoading();
              wx.showToast({
                  title:`上传成功:${proData.success}张`
              })
              console.log('上传结果',proData);
              return progress;
          }
      });
  },

  deleteImg(e){
      let index = e.currentTarget.dataset.index;
      let uploadImgData = this.data.uploadImgData;
      let img = this.data.imgList;
      img = _base.remove(true,img,index);
      uploadImgData = _base.remove(true,uploadImgData,index);
      this.setData({
          imgList:img,
          uploadImgData:uploadImgData
      })
  },

  //切换状态
  changeState(e){
      let index = e.currentTarget.id;
      let checkStatus = this.data.checkStatus;
      if(checkStatus !== index){
          this.setData({
              checkLabels:[]
          })
      }
      this.setData({
          checkStatus:index
      })
  },
 //评论
  remarkData(e){
      console.log('txt',e);
      let t = e.detail.value;
      this.setData({
          remark:t
      })
  },
 //选择标签
  checkLabel(e){
      let index = e.currentTarget.dataset.index;
      let check = this.data.checkLabels;
      let state = this.data.checkStatus;
      let labels = this.data.labels;
      let sign = check.findIndex(val=>index == val);
      if(sign !== -1){
        check = _base.remove(true,check,sign);
        labels[state][index].check = false;
      }else{
        check.push(index);
        labels[state][index].check = true;
      }
      this.setData({
          checkLabels:check,
          labels:labels
      })
      console.log('check',check);
  },

    formValidateSubmit: function (para) {
        var result = {
            status: false,
            msg: ''
        }
        if (!_base.validate(para.content, 'require')) {
            result.msg = '请输入反馈内容';
            return result;
        }
        if (!para.score) {
            result.msg = '请选择评价';
            return result;
        }
        result.status = true;
        result.msg = '';
        return result;
    },

  //提交评价
    submitData(){
        let that = this;
        let state = this.data.checkStatus;
        let label = '';
        let checks = this.data.checkLabels;
        let labels = this.data.labels;
        for(let o of checks){
            label += `${labels[state][o].txt};`
        }
        let para = {};
        para.soItemId = that.data.soItemId;
        para.score = state == 0 ? 5 : state == 1 ? 3 : state == 2 ? 1 : '';
        para.content = this.data.remark;
        let img_url1 = that.data.uploadImgData.join(";");
        para.img_url = img_url1;
        para.label = label;
        console.log('para',para);
        let validateResult = this.formValidateSubmit(para);
        if (!validateResult.status) {
            _base.showToast(validateResult.msg);
            return false;
        }
        _api.problem_feedback(para, (res) => {
            _base.showToast('提交成功', 'success');
            setTimeout(()=>{
                wx.redirectTo({
                  url: '../showEvalute/show?id='+that.data.soItemId
                })
            },1000)
        })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options);
      this.setData({
          soItemId: options.soItemId
      });
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
