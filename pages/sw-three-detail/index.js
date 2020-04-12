
import { Api } from "../../utils/api";
import { Base } from "../../utils/base";
import { login } from '../../utils/login.js';

let _base = new Base();
let _api = new Api();
let _login = new login();


Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfoModelFlag: false,//授权 显示/隐藏 弹框
    typeSetp:'',
    cur:0,
    brands: [],
    fcData:{},
    changePId:'',//项目ID
    valid_days:'',//项目有效期
    categoryId:'',//暂时为封窗该项目ID
    pinpaiId:'',//品牌id
    productList:[],
    height: wx.getSystemInfoSync().windowHeight,
    showTab: Boolean,
    commanderHiden: false,
    userInfo:{},//用户信息
    summariesJson:'',
    selectedProducts:{
      /**
       * 设计中的结构，每次更改选项，要修改这个系列里的内容，不影响其他系列的内容，因此用id做key
       * 系列id1:{
       *   name:铝材系列，
       *   选中的项:{}
       * }，
       * 系列id2:{
       *   name:五金系列，
       *   选中的项:{}
       * }
       */
    },
    //然后定义一个汇总对象,每次修改都需要重新计算汇总，可能会用于展示
    summary:{
      // 先系列的汇总，再每个系列的汇总 可以了  
      /**
       * 系列id1:{//汇总信息}，
       * 系列id2:{//汇总信息}
       */
    },
    allSum: { //大汇总
      
    },
    modelConetent:false,
    sharebtn:false,
    shareName:'',
    shareUrl:'',
    heightViewScroll:''//scroll高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,"爱我options")
    var datas = JSON.parse(options.data);


    this.setData({
      typeSetp: options.typeSetp, //顶部 方案步骤
      categoryId: options.categoryId,//项目iD 现在是封窗项目
      fcData: datas,
      shareName: options.shareName,
      shareUrl: options.shareUrl,
      heightViewScroll: wx.getSystemInfoSync().windowHeight
    })
    //品牌 下的产品展示
    this.selectBrandList(options.categoryId)
//方案总数据 || 自定义输入 
    if (options.summariesJson) {
      let summariesJson = decodeURIComponent(options.summariesJson)
      let step2summaries = JSON.parse(summariesJson);

      let step2summaries2Obj = {}
      for (var i = 0; i < step2summaries.length; i++){
        step2summaries2Obj['id_' + step2summaries[i].id] = step2summaries[i]
      }
      this.setData({  
        step2summaries2Obj: step2summaries2Obj,
        summariesJson: options.summariesJson
      })
    }

  },
  //查看详情
  changeImg:function(e){
    var arrimg = e.currentTarget.dataset.img;

    var title = e.currentTarget.dataset.title;

    arrimg = encodeURIComponent(JSON.stringify(arrimg))

    wx.navigateTo({
      url: `../sw-detail-img/sw-detail-img?arrimg=${arrimg}&title=${title}`,
    })

  },  

  //我的团长
  support: function () {
    let h = wx.getSystemInfoSync().windowHeight;
    this.selectComponent('#my-commander').getInfo()
    this.setData({
      height: h,
      commanderHiden: true,
      showTab: false
    })
  }, 
  //查询品牌
  selectBrandList:function(id){
    //true:id是数字，不是二维码进入；false:id是字符串，二维码进入
    var isQr = typeof parseInt(id) === 'number' && !isNaN(parseInt(id));
    var data = {}
    if(isQr){
      data.category_id = id
    }else{
      data.category_code = id
    }
    
    _api.selectBrandList(data,res=>{
      this.setData({
        brands:res,
        changePId: res[0].project_id
      })
      this.selectProductList(res[0].id)
    })
  },
  //选择系列
  changeProduct:function(e){
    var xilieindex = e.currentTarget.dataset.xilieindex;//系列的index

    var clicks = e.currentTarget.dataset.click;//点击了系列，重新排版

    var index = e.currentTarget.dataset.index;//产品的index

    var xilie = this.data.productList[xilieindex]

    var selectedProduct = xilie.productGroupList[index]

    
    xilie.selectSubItem = selectedProduct

    // console.log('选中了' + xilie.name + '系列中的项：' + selectedProduct.name)
  

    // console.log(xilie,"selectedProduct")
//这里就是自己赋值给自己，触发ui刷新，没别的数据
    let productList = this.data.productList

    //这里要克隆xilie对象，免得之后的计算又把源数据改了,应该不会改到里边的数据
    this.recordSelectedProductItem(xilie)
  

//summary加载完成 展示页面部分
    if (Object.getOwnPropertyNames(this.data.summary).length === productList.length){
      this.setData({
        modelConetent:true
      })
    }

//更新ui 每个属性的计算视图

    this.setData({
      productList: productList
    })
  },
  /**
   * 记录选择的系列以及选中项
   */
  recordSelectedProductItem (xilieAndItem){
    this.data.selectedProducts['xilie_' + xilieAndItem.id] = xilieAndItem
    //这里没有ui更新，不需要setdate
    this.subSummaryCalc(xilieAndItem)
  },
  /**
   * 小汇总计算
   */
  subSummaryCalc: function (xilieAndItem) {

    var subSummaryObj = {
      xilieId: xilieAndItem.selectSubItem.id,
      xilieName: xilieAndItem.count_name,
      productName: xilieAndItem.selectSubItem.name,
      //首先进入第三步 默认都显示第一个高亮铝材的第一个系列，五金的第一个系列 展示出来后就显示对应的价格 选择铝材的系列 再去做切换的计算
      sumPrice:0,
      smallPrice:0,
      sumList:''
      //items: [] //全部都要複製
    }
    var str = ' '
    var step2summaries2Obj = this.data.step2summaries2Obj
    let selectBrandProductList = xilieAndItem.selectSubItem.brandProductList
    for (let i = 0; i < selectBrandProductList.length; i++) {
      let product = selectBrandProductList[i]
      product.smallPrice = 0
      let category_attr_id = product.category_attr_id
      xilieAndItem.selectSubItem['ctarrid_' + category_attr_id] = product

      let sale_price = product.sale_price
      //第二步传传过来的数据
      let num = step2summaries2Obj['id_' + category_attr_id].val
      let name = step2summaries2Obj['id_' + category_attr_id].name
      let step2summaries2ObjUnit = step2summaries2Obj['id_' + category_attr_id].unit

      let stepSumPrice = this.formatFloat(step2summaries2Obj['id_' + category_attr_id].val * sale_price, 2)

      product.smallPrice = stepSumPrice
      
      subSummaryObj.sumPrice += stepSumPrice

      str += sale_price + '元/' + product.unit + '×' + num + step2summaries2ObjUnit + '+'

      console.log(name + '售价' + sale_price + '*第二步传过来的数量' + num + '=' + stepSumPrice)
    }

    subSummaryObj.sumList += str.substr(0, str.length - 1).replace(/\s*/g, "")

    subSummaryObj.sumPrice = this.formatFloat(subSummaryObj.sumPrice , 2)

    console.log(xilieAndItem.selectSubItem,'数据扁平化，便于计算')


    console.log('先第一步，根據caid分组，准备下一步对同组的进行合并计算,这里就要去找到第二步传过来的那个同组的对象，那里边有数量，这里只有单量')
    //好像漏了些，就是每个系列的转角什么的  拿这个category_attr_id去匹配传过来的id 1 2 3 相等的就相乘
    //sale_price这个字段


    var sumObj = this.data.summary||{}
    let oldSelected = sumObj['xilie_' + xilieAndItem.id]
    if (oldSelected){
      console.log('修改' + xilieAndItem.name + '的选择项为：' + JSON.stringify(subSummaryObj))
    }
    else{
      console.log('增加' + xilieAndItem.name + '的选择项：' + JSON.stringify(subSummaryObj))
    }
    sumObj['xilie_' + xilieAndItem.id] = subSummaryObj
    //为了方便调试，我把他更新在AppData窗口
    this.setData({
      summary: sumObj
    })
    this.allSummaryCalc()
  },
  /**
   * 大汇总计算
   */
  allSummaryCalc:function(){
    let summary = this.data.summary
    console.log(summary,'summary')

    let allSummary = {
      names:[],
      subVals:[],
      allSum:0
    }
    for (var fieldname in summary){
      let subSummary = summary[fieldname]
      allSummary.names.push(subSummary.xilieName + '-' + subSummary.productName)
      allSummary.subVals.push(subSummary.sumPrice)
      allSummary.allSum += subSummary.sumPrice
    }
    allSummary.allSum = this.formatFloat(allSummary.allSum,2)
    console.log('小汇总=' + JSON.stringify(summary))
    console.log('大汇总：' + JSON.stringify(allSummary))
    this.setData({
      allSum: allSummary
    })
  },
//浮点转换
  formatFloat :function(f, digit) {
    let m = Math.pow(10, digit);
    let num = Math.round(f * m) / m;
    return num;
  },
  setDefaultData:function(){
    //最快就是循环伪造一个event,但效率不高
    /*
    var xilieindex = e.currentTarget.dataset.xilieindex;//系列的index
    var index = e.currentTarget.dataset.index;//产品的index
    */

    for (var i = 0; i < this.data.productList.length;i++){

      var mockEvent = {
        currentTarget:{
          dataset:{
            xilieindex: i,
            index:0
          }
        }
      }
      this.changeProduct(mockEvent)
    }
    
  },

  //选择品牌
  change:function(e){
    console.log(e)
    var index = e.currentTarget.dataset.index; 
    var id = e.currentTarget.dataset.id
    var projectid = e.currentTarget.dataset.item.project_id;
    var valid_days = e.currentTarget.dataset.item.projectInfo.valid_days

//是分享的品牌id 则显示当前的产品 不是则显示第一个
    this.selectProductList(id);
    
    this.setData({
      cur: index,
      summary: {},
      pinpaiId:id,
      changePId: projectid,
      valid_days: valid_days,
      modelConetent:false
    })

  },
  //品牌下的系列
  selectProductList:function(id){
    _api.selectProductList(id,res=>{
      this.setData({
        productList: res
      })
      this.setDefaultData()
    })
  },
//跳转预算量尺
  godetails:function(){

    let ThreeDetailObjs = {
      typeSetp: this.data.typeSetp,
      categoryId: this.data.categoryId,
      shareName: this.data.shareName,
      shareUrl: this.data.shareUrl,
      changePId: this.data.changePId
    }

    if (!this.data.userInfo.user_name){
        wx.navigateTo({
          url: '../newLogin/index?ThreeDetailObjs=' + JSON.stringify(ThreeDetailObjs),
        })
        return
    }
    let { typeSetp, categoryId, shareName, shareUrl, changePId } = ThreeDetailObjs
    wx.navigateTo({
      url: '../sw-count/index?typeSetp=' + typeSetp + '&categoryId=' + categoryId + '&shareName=' + shareName + '&shareUrl=' + shareUrl + '&id=' + changePId+'',
    })
    
    ThreeDetailObjs = null
  },

  //支付接口
  payOrder:function(){
    var changePId = this.data.changePId || this.data.brands[0].project_id
    wx.navigateTo({
      url: '/pages/my/my-deposit/deposit-add2/deposit-add?id=' + changePId + '&type=1 &data=' + this.data.valid_days + ''
    })
  },


  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let userInfo = wx.getStorageSync('loginUser');

    if (userInfo.user_name){
      this.setData({
        'userInfo.user_name': userInfo.user_name,
      })
    }
    this.setData({
      userInfo: userInfo
    })

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

