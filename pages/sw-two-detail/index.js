// pages/sw-two-detail/index.js

/**
 *  数据结构 后端没有进行扁平化处理，数据格式需要前端去处理。 
 *  
 *  备注的很详细了，一点点捋过来
 * 
 * **/
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
    shareName:'',
    shareUrl:'',
    categoryId:'',//封窗的项目ID
    typeSetp:'',
    areaList:[],
    summaries:[],
    resultCode1005:false// 此户型没有方案
  },

  //选择方案切换
  planClick: function (e) {
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    
    var areaList = this.data.areaList;
    //在這裏做，找到選中的plane
    var selectArea = null
    for (var i = 0; i < areaList.length; i++) {
      if (areaList[i].id===id){
        selectArea = areaList[i]
        break
      }
    }

    selectArea.selectWitch = index
    selectArea.selectPlan = selectArea.planDetailList[index]

    var topAll = this.calcSummaryInfo(areaList)
    this.setData({
      areaList: areaList, 
      summaries: topAll
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'112333')
    this.setData({
      typeSetp: options.typeSetp,
      categoryId: options.categoryId,
      id: options.id,
      shareName: options.shareName,
      shareUrl: options.shareUrl
    })


    this.selectHouseTypeById(options.id) //户型ID
   
  },
//方案详情
selectHouseTypeById:function(id){
  _api.selectHouseTypeById(id,res=>{
    console.log(res,"233333")
//resultCode===1005 此户型没有编辑方案
    if (!res){
      this.setData({
        resultCode1005:true
      })
  }else{

      var houseAreaList = res.houseAreaList;

      for (var i = 0; i < houseAreaList.length; i++) {
        let area = houseAreaList[i]

        var planDetailList = area.planDetailList

        for (var j = 0; j < planDetailList.length; j++) {
          planDetailList[j].windowInfo = planDetailList[j].categoryAttrList
        }

        //每个区域自动初始化一个默认的方案
        area.selectWitch = 0//默认选择方案一
        area.selectPlan = area.planDetailList[0]//方案一对象
      }


      //每个区域数值计算综合 显示在顶部  我在这里做的计算 综合
      //注释掉我看看 en
      var topAll = this.calcSummaryInfo(houseAreaList)

      this.setData({
        areaList: houseAreaList,
        summaries: topAll
      })
  }
    

  })
},

calcSummaryInfo: function (areaList){

  let allCategoryAttrs = new Array()

  for (var i = 0; i < areaList.length; i++) {
    let list = areaList[i].categoryAttrList
    let copiedList = JSON.parse(JSON.stringify(list))

    allCategoryAttrs.push.apply(allCategoryAttrs, copiedList)
    //开始扇数这些不知要不要加 开启扇的总和我加起来了 ，我要对象
    allCategoryAttrs.push.apply(allCategoryAttrs, areaList[i].selectPlan.categoryAttrList)
  }
  console.log(allCategoryAttrs,"allCategoryAttrs")

  let groupByCategoryIdMap = {}
  for (var i = 0; i < allCategoryAttrs.length; i++) {
  
    let cgidSumObj = groupByCategoryIdMap['cgid_'+allCategoryAttrs[i].id]
    console.log(cgidSumObj, "cgidSumObjcgidSumObj")


    if (!cgidSumObj){ 
      cgidSumObj = Object.assign({}, allCategoryAttrs[i])  //走了这里
      groupByCategoryIdMap['cgid_' + allCategoryAttrs[i].id] = cgidSumObj
    }
    else{//相同元素值相加
      console.log('相同元素值相加:', cgidSumObj, allCategoryAttrs[i].val)
      cgidSumObj.val += allCategoryAttrs[i].val
      console.log('相加后:' + JSON.stringify(cgidSumObj))
    }
    cgidSumObj.val = this.formatFloat(cgidSumObj.val, 2)
  }
 

  console.log('groupByCategoryIdMap=' + JSON.stringify(groupByCategoryIdMap))
  let newArr = []
  for (var fieldName in groupByCategoryIdMap){
    newArr.push(groupByCategoryIdMap[fieldName])
  }
  return newArr
},
  //浮点转换
  formatFloat: function (f, digit) {
    let m = Math.pow(10, digit);
    let num = Math.round(f * m) / m;
    return num;
  },
// 去第三步
  goThreeDetail:function(){
    var summary = this.data.summaries;
    console.log(summary,"summary")
    var areaList = this.data.areaList;
    var sum = 0;
    for (var i = 0; i < areaList.length;i++){
       sum+=areaList[i].selectPlan.windowInfo.val
    }
//第三步 数据格式
    let summariesJson = JSON.stringify(summary)
    summariesJson = encodeURIComponent(summariesJson)

//第三步 数据显示
    var defuaultData = JSON.stringify(summary)

    wx.navigateTo({
      url: '../sw-three-detail/index?typeSetp=' + this.data.typeSetp + '&categoryId=' + this.data.categoryId + '&data=' + defuaultData + '&summariesJson=' + summariesJson + '&shareName=' + this.data.shareName + '&shareUrl=' + this.data.shareUrl+'',
    })

  },


  //点击放大图片
  lookImg:function(e){
    var imgs = e.currentTarget.dataset.img;
    var arr = [];arr.push(imgs)
    wx.previewImage({
      current: arr[0],
      urls: arr
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

    let obj = {
      title: this.data.shareName,
      url: "pages/sw-index/sw-index?shareCategoryId=" + this.data.categoryId + '&shareName=' + this.data.shareName + '&shareUrl=' + this.data.shareUrl + '',
      img: this.data.shareUrl
    }
    return _base.shareData(obj);

  }
})