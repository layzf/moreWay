// pages/y-assess/y-assess.js
import { Api } from "../../utils/api";
import { Base } from "../../utils/base";
let _base = new Base();
let _api = new Api();
//过滤
class filterStart {
 constructor(start){
   this.start = start
 }
  starts(start) {  //过滤星星
    this.start = start;
    return this.filter(this.start, true)
  } 
  serve(serve){  //过滤 云标签
    this.serve = serve;
    return this.filter(this.serve,false)
  }
  filter(list, cur = true ) {
    var arr = [];
    var text = ''
      list.filter(item => {
        if (cur) {
          if (item.flag.toString().includes(2)) {
            arr.push(item)
          }
        }else{

          if(item.type==true){

            text += item.text+','

          }
        }
    })
    return cur ? arr.length : text = text.length > 0 ? text.substr(0, text.length - 1):''
   

  }
}

Page({
  data: {
    objs:{
      arrServiceImg: [],//服务的上传图片
      image_urls: [],//验房师的上传图片
      service_desc: '',//服务输入的评价
      desc: '',//验房师输入的评价
    },
    applyId: '',//列表id
    groupId: '',//列表团id
    lookType:false ,//查看评论状态
    picUrl: '' + _base.baseRequestUrl+'file/upload.json',
    //服务评价的星星
    stars:[
      { img: '../../images/star-1.png', flag: 1, aimg: '../../images/star.png' },
      { img: '../../images/star-1.png', flag: 1, aimg: '../../images/star.png' },
      { img: '../../images/star-1.png', flag: 1, aimg: '../../images/star.png' },
      { img: '../../images/star-1.png', flag: 1, aimg: '../../images/star.png' },
      { img: '../../images/star-1.png', flag: 1, aimg: '../../images/star.png' },
    ],
 //验房师评价的星星
    stars_1: [
      { img: '../../images/star-1.png', flag: 1, aimg: '../../images/star.png' },
      { img: '../../images/star-1.png', flag: 1, aimg: '../../images/star.png' },
      { img: '../../images/star-1.png', flag: 1, aimg: '../../images/star.png' },
      { img: '../../images/star-1.png', flag: 1, aimg: '../../images/star.png' },
      { img: '../../images/star-1.png', flag: 1, aimg: '../../images/star.png' },
    ],
    serve: [
      { text: '态度好', type: false},
        {text: '服务热情',type:false},
        {text:'沟通顺畅',type:false}
      ],
    serve_1: [
      { text: '态度好', type: false },
      { text: '验房仔细', type: false },
      { text: '验房专业', type: false }
    ],

    areaInt:'',//服务评价
    areaInt_1:'',//验房师评价

    img:[],//上传图片返回
    img_1:[],//验房师的评价


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,"optionsoptionsoptions")

    if (options.lookType){
      console.log('查看评论')
      this.setData({
        lookType: options.lookType,
        applyId: options.applyId,
      })
      
      /**从这里开始改**/
      _api.queryJudgment(options.applyId, res => {
        var that = this
        //星星的数量
        var level = res.level
        var service_level = res.service_level
        //评价的标签
        var service_word = res.service_word;
        var word = res.word;
        //上传的图片
        var service_image_urls = res.service_image_urls;
        var image_urls = res.image_urls;
        //输入的评价
        var service_desc = res.service_desc;
        var desc = res.desc;
        //字符===>数组回调
        this.arrFunction(service_image_urls, image_urls, res => {

          let arrServiceImg = res.service_image_urls

          let image_urls = res.image_urls

          //服务的标签
          this.data.serve.forEach((val) => {
            val.type = service_word.indexOf(val.text) > -1
          })

          //验房师的标签
          this.data.serve_1.forEach((val) => {
            val.type = word.indexOf(val.text) > -1
          })
          //星星
          var stars = this.forFunction(that.data.stars, service_level)

          var stars_1 = this.forFunction(that.data.stars_1, level)

          this.setData({
            stars: that.data.stars,
            stars_1: that.data.stars_1,
            serve: this.data.serve,
            serve_1: this.data.serve_1,
            'objs.service_desc': service_desc,
            'objs.desc': desc,
            'objs.arrServiceImg': arrServiceImg,
            'objs.image_urls': image_urls,
          })
        })
      })

    }else{
      console.log('去评论')
      this.setData({
        applyId: options.applyId,
        groupId: options.groupId
      })
    }

  },

//查看评论：循环星星
  forFunction(startsArr,num){

    startsArr.forEach((val, index) => {
      let starsNum = startsArr.slice(0, num)
      starsNum.forEach((vals) => { vals.flag = 2 })
    })
    
    return startsArr
  },
  //字符转数组
  arrFunction(service_image_urls,image_urls,callback){
    var obj = {}

    if (service_image_urls){
        obj.service_image_urls = service_image_urls.split(',')
   }
    if (image_urls) {
      obj.image_urls = image_urls.split(',')
    }

    callback(obj)
  },
  //查看图片
  lookimgs:function(e){
    var id = e.currentTarget.dataset.id;
    var item = e.currentTarget.dataset.item;
    wx.previewImage({
      current: item, // 当前显示图片的http链接
      urls: id === 'true' ? this.data.objs.arrServiceImg : this.data.objs.image_urls // 需要预览的图片http链接列表
    })
  },
  //选择 云 标签
  checkBox:function(e){

    if (this.data.lookType) {    //查看评价禁止点击
      return
    }
    var oIndex = e.currentTarget.dataset.index;
    var status = e.currentTarget.dataset.status;
    var type = e.currentTarget.dataset.type;

    var list = status == 1 ? this.data.serve : this.data.serve_1;

    list.forEach((item, index, arr) => {
      var serve = ''
      if (status == 1) {
        serve = `serve[${index}].type`
      } else {
        serve = `serve_1[${index}].type`;
      }
   
      if (index == oIndex) {
        this.setData({
          [serve]: !type
        })
      }
    })

  },
  //输入框评价
  areaInt:function(e){

    var areaInt = e.detail.value;

    var status = e.currentTarget.dataset.status;

    status == 1 ? this.setData({ areaInt: areaInt }) : this.setData({ areaInt_1: areaInt })

  },
  //星星
  star: function (e) {

    if (this.data.lookType) {  //查看评价禁止点击
      return
    }

    var that = this;

    var status = e.currentTarget.dataset.status;

    var oIndex = e.currentTarget.dataset.index;

    var list = status == 1 ? this.data.stars : this.data.stars_1;

    for (var i = 0; i < list.length; i++) {

      var allItem = status == 1 ? 'stars[' + i + '].flag' : 'stars_1[' + i + '].flag';

      that.setData({

        [allItem]: 1

      })

    }

    for (var i = 0; i <= oIndex; i++) {

      var item = status == 1 ? 'stars[' + i + '].flag' : 'stars_1[' + i + '].flag';

      that.setData({

        [item]: 2

      })

    }

  },
  // 上传图片返回
  upImgData(e) {
    console.log(e)
    let imgArr = [];
    // 只需要把上传图片数量和传回来的数组统计一下就OK了!
    for (let i = 0, len = e.detail.url.length; i < len; i++) {
      if (e.detail.url[i].path_server != "") {
        imgArr.push(e.detail.url[i].path_server);
        // 这里放最大上传数量即可
        if (imgArr.length == 3) {
          wx.showToast({
            title: '上传成功',
            icon: 'none'
          })
        }
      }
    }
    e.detail.status == 0 ? this.data.img = imgArr : this.data.img_1 = imgArr;

  },

  //提交评论
  put:function(){
    var newStart = new filterStart(); //服务评价 星星数
    var newServe = new filterStart(); //服务评价 标签

    var newStart_1 = new filterStart();//验房师评价 星星数
    var newServe_1 = new filterStart(); //验房师评价 标签

    newStart = newStart.starts(this.data.stars)
    newStart_1 = newStart_1.starts(this.data.stars_1)

    newServe = newServe.serve(this.data.serve);   
    newServe_1 = newServe_1.serve(this.data.serve_1);  


    var data={

      applyId: this.data.applyId,
      groupId: this.data.groupId,

      newStart: newStart, //星星数量
      newServe: newServe, //服务评价（标签）
      imgs: this.data.img.join(','),
      desc: this.data.areaInt,

      newStart_1:newStart_1, //星星数量
      newServe_1:newServe_1, //服务评价（标签）
      imgs_1: this.data.img_1.join(','),
      desc_1: this.data.areaInt_1

    }
    console.log(`%c ${data}`,`color:green;font-weight:bold`)

    _api.judgment(data,res=>{
      console.log(res,"1")
      if (res.resultCode==1000){
        _base.showToast('评论成功', 'success');
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
        },200)
      }
    })  
      
  },

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