// pages/door-index/index.js
import { Api } from "../../utils/api";
import { Base } from "../../utils/base";
import { login } from '../../utils/login.js';
const throttles = require('../../utils/throttle.js')

let _base = new Base();
let _api = new Api();
let _login = new login();

Page({
  rectTop:0,
  Y_top:0,  
  data: {
    inputArr:[ 
      { name: '柜体面积', id: 1, unit:'㎡'},
      { name: '平开门面积', id: 2, unit: '㎡'},
      { name: '移门面积', id: 3, unit: '㎡'},
    ],
    commander:{
      height: '', //设备高度
      commanderHiden: false,
      showTab: Boolean,
    },
    ValIdArr:{},
    productList: [],//品牌列表

    productListIndex: {
       /*
         index: {},  //品牌下标
         checked:{} ,//选中的id
       */
      checked: {},
    },

    showPrice:false,
    selectProductList:[],//系列
    moneyAll:0,//总计
    smallText:{},//小计
    changeMoney:{}, //选择的价格
    intArea:{}, //输入的面积
    loginStatus:null, //登录状态
    shareCategoryId:'',//项目ID
    valid_days:'',//订金有效期
    changeMoneyLength:0,
    loginUser:{},
    options:{},
    projectExplainList:[],//项目说明
    PriceBoxTop:'',//距离顶部距离
    fixedConStatus:false,//价格固定定位

    project_type:'',//选择品牌是否是安居佳。
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selectBrandList(options);
    this.setData({
      shareCategoryId:options.shareCategoryId,
      options: options
    })
    //设置标题
    wx.setNavigationBarTitle({title: options.category_desc})
  },
  //查看价格 没有授权去授权
  getUserInfo() {
    wx.navigateTo({ url: '../newLogin/index?toUrl=none' })
  },
  lookImg(e){
    var item = _base.getDataSet(e, 'items') 
    var index = _base.getDataSet(e, 'index') 
    var img = item.productInfo.map(item => item.img_url)
    getApp().previewImage(img, index);
  },
  //预约量尺
  godetails: function () {
    /**
     *  @Parma !anujiaType 预约量尺提交的ID为77（梅溪湖店）
    */
    var anujiaType = this.data.anujiaType;
    var options = this.data.options;

    var ThreeDetailObjs = {
      typeSetp: null,
      categoryId: this.data.shareCategoryId,//项目ID
      changePId: (options.code == 'ajj' || this.data.project_type == 4) ? 106 : this.data.productListIndex.project_id, //项目ID
      shareName:options.shareName,
      shareUrl:options.shareUrl,
    }

//去授权
    if (!this.data.loginUser.user_name) {
      wx.navigateTo({
        url: '../newLogin/index?ThreeDetailObjs=' + JSON.stringify(ThreeDetailObjs) + '&toUrl=swcount',
      })
      return
    }
 //去量尺页面
    let { typeSetp, categoryId, shareName, shareUrl, changePId } = ThreeDetailObjs

    wx.navigateTo({
      url: '../sw-count/index?typeSetp=' + typeSetp + '&categoryId=' + categoryId + '&shareName=' + shareName + '&shareUrl=' + shareUrl + '&id=' + changePId + '&isShowCoun=1' ,
    })

    ThreeDetailObjs = null
  },
  //交订金
  getMoney(){
    var changePId = this.data.productListIndex.project_id
    var loginStatus = this.data.loginStatus;
    var anujiaType = this.data.anujiaType ; //跳到安居佳列表页面

    var url = ''

    if (loginStatus){
      url = '/pages/my/my-deposit/deposit-add2/deposit-add?id=' + changePId + '&type=1 &data=' + this.data.valid_days;
    }else{
      url = '../newLogin/index?ziId=' + changePId + '&type=1 &data=' + this.data.valid_days + '&toUrl=deposit'
    }

    if (this.data.options.code == 'ajj' || this.data.project_type == 4) {
      url = '/pages/anjujia/anjujia?keys=anjujia';
    }

    wx.navigateTo({
      url: url
    })
      
  },
  //检测输入的面积是否为空
  inspect() {
    var valArea = this.data.intArea;
    var intArr = this.data.inputArr.reverse();
    var type = false
    Object.keys(intArr).forEach(item => {

      if (!valArea['area_' + intArr[item].id]) {
        _base.showToast('请输' + intArr[item].name, 'none')
        type = true
      }
    })
    return type
  }, 

  //品牌列表
  selectBrandList(item){
    var id = item.shareCategoryId;
    var data = {}
    if (item.QR === 'formIndex'){
      data.category_code = id
    }else{
      data.category_id = id
    }
      
    _api.selectBrandList(data,res => {
      this.changeProductId(res[0].id, res[0].project_id, res[0].projectInfo.project_type)
      this.setData({
        productList:res,
        project_type: res[0].projectInfo.project_type  //是否 是安居佳项目
      })


    })
  },
  //选择品牌 
  changeProductId(e, project, project_type){
 
    var id = typeof (e) === 'object' ? _base.getDataSet(e, 'id') : e;
    var project_id = typeof (e) === 'object' ? _base.getDataSet(e, 'project') : e;
  
    var index = typeof (e) === 'object' ? _base.getDataSet(e, 'index') : 0;
    var valid_days = typeof (e) === 'object' ? _base.getDataSet(e,'vaildDays'): null //订金有效期

    var project_type = typeof (e) === 'object' ? _base.getDataSet(e, 'project_type') : project_type //订金有效期

    console.log(project_type,"project_type")

    var selectProductList = this.data.selectProductList;
    var productListIndex = this.data.productListIndex;

    this.setData({ 
      'productListIndex.index': index,
      'productListIndex.proId': id,
      'productListIndex.project_id': project || project_id ,
       valid_days: valid_days,
       project_type: project_type,
    })

    this.selectProductList(id)

//项目详情图片
    _api.getProjectInfo(project || project_id, res => {
      var that = this;
      this.setData({
        projectExplainList: res.data.projectExplainList
      },()=>{
        wx.createSelectorQuery().select('.proImgs').boundingClientRect(function (rect) {
          if(rect){
            console.log(rect,"rect")
            that.setData({
              rectTop: rect.top
            })
          }
        }).exec()
      })
    })

    selectProductList.forEach(item1 => {

      item1.productInfo.forEach(item2 => {
        if (item2.checked) {
          productListIndex['checked']['id_' + item2.id] = item2.id;
        }

      })

    })

  },
  //品牌下的系列
  selectProductList(id){
    var that = this;
    var productListIndex = this.data.productListIndex;
    var checked = productListIndex.checked;

    //获取当前选中的选项
    var checkedarr = [];

    if (Object.keys(checked).length>0){
      for (let i in checked) {
        checkedarr.push(checked[i])
      }
    }

    _api.selectProductList(id,res=>{
    
      res.forEach((val1, index1) =>{
        res[index1].productInfo = [];
        val1.productGroupList.forEach((val2,index2) => {
          val2.brandProductList.forEach( (val3,index3) =>{
            
            val3.checked = false

            if (checkedarr.length > 0) {  //如果之前有选择产品，切换品牌后正常显示；
 
              if (val3.id == checked['id_'+val3.id]){
                  val3.checked = true
                  res[index1].category_attr_id = val3.category_attr_id;
               }
            }
            res[index1].productInfo.push(val3)

          })
        })

      })
     
      this.setData({
        selectProductList:res,
      })

      this.allMoenys()



    })
  },
  //用户输入键盘事件
  intInput(e){
    var that = this;
    var id = _base.getDataSet(e,'id');
    this.intFn(e, id);
  },

  intFn(e,i){
    var int = e.detail.value;

    var str = 'intArea.area_'+i;

    this.setData({
      [str]: int,
    })

    this.allMoenys(e);

  },
  //取消选择框
  radioChange1(e){
    var checkedObj = this.data.productListIndex.checked;
    let checked = _base.getDataSet(e, 'checked');
    let index = _base.getDataSet(e, 'index');
    let categoryid = _base.getDataSet(e, 'categoryid');
    let id = _base.getDataSet(e, 'id');
    let changeMoney = this.data.changeMoney;
    let arr = this.data.selectProductList;
    let smallText = this.data.smallText;
    
    if (checked){

      arr[index].productInfo.forEach( item =>{
          if(item.id == id){
            item.checked = false
            delete smallText['text_' + categoryid];
            delete changeMoney['area_' + categoryid];
            delete checkedObj['id_' + id];
            delete arr[index]['category_attr_id'];
          }
      })

      this.allMoenys(e);

      this.setData({
        selectProductList: arr,
        changeMoneyLength: Object.keys(this.data.changeMoney).length
      })
    }

  },
  //单选框
  radioChange: function (e) {
    var that = this;
    wx.vibrateShort();
  
    var checkedObj = this.data.productListIndex.checked;
    let index = _base.getDataSet(e,'index')

    let categoryid = _base.getDataSet(e,'categoryid') //关联属性的ID
   
    let ValId = e.detail.value;
    let arr = this.data.selectProductList;

    arr[index].productInfo.forEach((items, i) =>{
      if (items.id != ValId){
          items.checked = false
          delete checkedObj['id_' + items.id];
        }else{
          this.data.changeMoney['area_' + categoryid] = items.sale_price;
          arr[index].category_attr_id = items.category_attr_id
          items.checked = true
        }
      })

    this.setData({
      selectProductList:arr,
      changeMoneyLength: Object.keys(this.data.changeMoney).length
    },()=>{
      
    })

    this.allMoenys(e);

  },

  onPageScroll: throttles.throttle(function(e){
    console.log(e)
    var that = this;
    var scroll = this.data.Y_top;
    console.log(scroll,"scroll")
    if (e.scrollTop > scroll) {
      that.setData({
        fixedConStatus: true
      })
    } else {
      that.setData({
        fixedConStatus: false
      })
    }

  },200),
  //浮点转换
  formatFloat: function (f, digit) {
    let m = Math.pow(10, digit);
    let num = Math.round(f * m) / m;
    return num;
  },

//计算总价：
  allMoenys(e){
    var that = this;
    var valArea = this.data.intArea;

    var selectProductList = this.data.selectProductList;

    var num = 0

    var smallText = {};

    var proId = this.data.productListIndex.proId;

    selectProductList.forEach( (item, i) => {
      var id = item.category_attr_id;
      var str = ['text_' + id + 'o_' + proId]
      item.productInfo.forEach((item1, index) =>{
        
          if (item1.checked && valArea['area_' + item1.category_attr_id]){
          //总价
            num += item1.sale_price * valArea['area_' + item1.category_attr_id];

            //小计
              item.name = item.name.replace('选择', '')

            smallText[str] = item.name + '：' + valArea['area_' + item1.category_attr_id] + '㎡ * ' +
              item1.sale_price + '元/㎡' + ' = ' +
              this.formatFloat(valArea['area_' + id] * item1.sale_price, 2) + '元'
           }
        })
      })
   
    this.setData({
      moneyAll: this.formatFloat(num,2),
      smallText: smallText
    })

    wx.createSelectorQuery().select('.smallText').boundingClientRect( (rect) =>{

      var scroll = this.data.rectTop
      console.log(wx.getSystemInfoSync().windowHeight, scroll,"aaaa")

      if (rect) {
         this.setData({
           Y_top: scroll - wx.getSystemInfoSync().windowHeight
         })
      }
    }).exec()


  },

  //咨询团长
  callCapital() {
    let h = wx.getSystemInfoSync().windowHeight;
    this.selectComponent('#my-commander').getInfo()
    this.setData({
     'commander.height': h,
      'commander.commanderHiden': true,
      'commander.showTab': false
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let loginStatus = wx.getStorageSync('loginStatus');
    let loginUser = wx.getStorageSync('loginUser');
    this.setData({
      loginStatus: loginStatus,
      loginUser: loginUser
    })
    if(loginStatus){
      this.setData({
        showPrice:true
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    let obj = {
      title: this.data.options.shareName,
      url: "pages/door-index/index?shareCategoryId=" + this.data.options.shareCategoryId,
      img: this.data.options.shareUrl
    }

    return _base.shareData(obj);
  }
})