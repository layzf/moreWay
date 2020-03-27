
import {Api} from "../../utils/api";
import {Base} from "../../utils/base";
import {login} from '../../utils/login.js';

let _base = new Base();
let _api = new Api();
let _login = new login();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //分类数据
    items:[],
    checkId:1,
    checkIndex:1,
    //获取当前设备高度
    height:0,
    scrollHeight:0,
    page:1,
    canLoad:true,
    total:0,
    newitems:[]
  },

    loadMore(){
      let that = this;
      let index = this.data.checkIndex;
      let page = this.data.page;
      let temp = this.data.items;
      let total = this.data.total;
      let height = wx.getSystemInfoSync().windowHeight
      let tempHeight = this.data.scrollHeight;
      console.log('page:'+page,'total:'+total);
      if(index===0 || index>2){
        return false;
      }
      if(page == total){
          return false;
      }
      ++page;
      let data = {
            page:page,
            pagesize:20,
            timeType:index
          }
        _api.progressList(data,res=>{
       
            let list = temp[index].projectInfoList;
            list = list.concat(res.data);
            temp[index].projectInfoList = list;
            temp = _base.reLoadData(temp);


  
            let h = tempHeight;
            if(temp[index].t0.length>0){
                h += 90;
                if(temp[index].t0.length>3){
                    h += 90
                }
            }
            if(temp[index].t1.length>0){
                h += 90;
                if(temp[index].t1.length>3){
                    h += 90
                }
            }
            if(temp[index].t2.length>0){
                h += 90;
                if(temp[index].t2.length>3){
                    h += 90
                }
            }
            if(h>height){
                h = height
            }
            that.setData({
                items:temp,
                page:page,
                scrollHeight:h
            })
            wx.setStorageSync('index', '');
        })
    },
    //获取数据
    getData:function(){
      let that =this;
      let option = this.data.option;
      let h = wx.getSystemInfoSync().windowHeight;
      let data = {
          parentId:0,
          id:0
      }
        _api.getClassfication(data,res2=> {
     
                let temp = [{categoryName:'周末团'},{categoryName:'长期团'}];
                temp = temp.concat(res2.data);
                let height = temp.length * 90+126;
                temp = _base.reLoadData(temp);
                console.log('temp',temp);

                if(height>h){
                    height = h;
                }
                let index = wx.getStorageSync('index');
                index = index?index:that.data.checkIndex;
                if(index === 0){
                    let id = wx.getStorageSync('village_id');
                    _api.collectPredect(id, (res) => {
                        temp[index].projectInfoList = res.data;
                        that.setData({
                            items:temp,
                            checkId:res2.data[index].id,
                            height:height,
                            scrollHeight:h,
                            checkIndex:index
                        })
                    })
                }else{
                    if(index<3){
                        let data = {
                            page:1,
                            pagesize:50,
                            timeType:index
                        }
                        _api.progressList(data,res=>{
                            temp[index].projectInfoList = res.data;
                            temp = _base.reLoadData(temp);
                          
                            let tempheight = 240;
                            if(temp[index].t0.length>0){
                                tempheight+=56;
                                tempheight +=(_base.getRow(temp[index].t0.length)*53);
                            }
                            if(temp[index].t1.length>0){
                                tempheight+=56;
                                tempheight +=(_base.getRow(temp[index].t1.length)*53);
                            }
                            if(temp[index].t2.length>0){
                                tempheight+=56;
                                tempheight +=(_base.getRow(temp[index].t2.length)*53);
                            }
                            let h = wx.getSystemInfoSync().windowHeight;
                            if(tempheight>h){
                                tempheight = h;
                            }
                            that.setData({
                                items:temp,
                                checkId:res2.data[index]?res2.data[index].id:0,
                                height:height,
                                scrollHeight:tempheight,
                                checkIndex:index,
                                total:res.total
                            })

                          console.log('temp3', this.data.items[1]);
                            wx.setStorageSync('index', '');
                        })
                    }
//长期团的广告位
                  that.baseinfo()

                }


        });
    },
//每一列选项内容的头部内容
  baseinfo:function(){
    var that = this;
    let id = wx.getStorageSync('village_id');
    let index = that.data.checkIndex;
    console.log(index,"indexindexindexindex")
//长期团的广告位显示 暂时 改为  封窗的项目！
    if (index == 1) {
      _api.selectCategoryList(res => {
        var map = res.map((item) => ({
          'index_img': item.icon,
          'name': item.share_name,
          'id': item.id,
          'shareName': item.share_name,
          'shareUrl': item.share_url,
          'fc':true
        }))
        that.setData({
          newitems: map,
        })
      })
    }else{
      _api.collectPredect(id, (res) => {
        console.log(res, "aahahh ")
        let h = res.data.length * 200;
        let height = wx.getSystemInfoSync().windowHeight
        if (h > height) {
          h = height;
        }
        var datas = res.data
        datas.splice(1, datas.length-1);
        that.setData({
          newitems: datas
        })
      })
    }

    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
      let index = wx.getStorageSync('index');
      if(index){
        this.getData();
      }
  },

  onReady(options){
    wx.hideShareMenu()
      console.log('执行了');
      var that = this;
      _login.login().then((res) => {
          console.log('授权数据',res);
          if (res == "loginisnot") {
              wx.getUserInfo({
                  success: function (res) {
                      wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl);
                      wx.setStorageSync('nickName', res.userInfo.nickName);
                      wx.setStorageSync('encrypted', res);
                      that.setData({
                          show_modal: false,
                      })
                      _login.getToken();
                      setTimeout(res => {
                          that.getData();
                      }, 500)
                  },
                  fail: function () {
                      that.setData({
                          show_modal: true,
                      })
                  }
              })
          }else{
              that.getData();
          }
      });
      this.setData({
          appointTap: false
      })


  },
  //选择类别
  checkItem:function(data){
    let id = data.currentTarget.id;
    let item = this.data.items;
    let index = data.currentTarget.dataset.index;
    this.setData({
      checkIndex: index
    })
    this.baseinfo()
      wx.setNavigationBarTitle({
        title: item[index].categoryName
      })

    if(index === 0){
        let id = wx.getStorageSync('village_id');
        _api.collectPredect(id, (res) => {
            item[index].projectInfoList = res.data;
            let h = res.data.length*200;
            let height = wx.getSystemInfoSync().windowHeight
            if(h>height){
                h = height;
            }
            this.setData({
                items: item,
                checkId:id,
                scrollHeight:h
            })
        })

    }else{

        let h = wx.getSystemInfoSync().windowHeight;
        if(index<3){
            let data;
            if(index===1){
                data = {
                    page:1,
                    pagesize:20,
                    timeType:1
                }
                console.log("aaaa")
            }else if(index===2){
                data = {
                    page:1,
                    pagesize:20,
                    timeType:2
                }
            }
            _api.progressList(data,res=>{
                console.log('res',res);
                item[index].projectInfoList = res.data;
                item = _base.reLoadData(item);
                let tempheight = 240;
                if(item[index].t0.length>0){
                    tempheight+=56;
                    tempheight +=(_base.getRow(item[index].t0.length)*53);
                }
                if(item[index].t1.length>0){
                    tempheight+=56;
                    tempheight +=(_base.getRow(item[index].t1.length)*53);
                }
                if(item[index].t2.length>0){
                    tempheight+=56;
                    tempheight +=(_base.getRow(item[index].t2.length)*53);
                }
                let h = wx.getSystemInfoSync().windowHeight;
                if(tempheight>h){
                    tempheight = h;
                }
                console.log('height',tempheight);
                this.setData({
                    items: item,
                    checkId:id,
                    total:res.total,
                    scrollHeight:tempheight,
                    page:1
                })
            })
        }else{
            let len = item[index].projectInfoList.length;
            if(len<3 && len>0){
                let height = 0.4*len*h+96;
                if(height>h){
                    h = height;
                }
            }
            this.setData({checkId:id,scrollHeight:h,page:1});
        }
    }



  },
  //每一列表头部的跳转
  baseinfoItem: function (e) {
    var event = e.currentTarget.dataset;
    let deInfo = e.currentTarget.id;
    var fc = event.type; //是否跳转到封窗页面

      if(fc){
        var shareName = event.sharename;
        var shareUrl = event.shareurl;
        wx.navigateTo({
          url: '/pages/sw-index/sw-index?shareCategoryId=' + deInfo + '&shareName=' + shareName + '&shareUrl=' + shareUrl + ''
        })
      }else{

        let village = wx.getStorageSync('village_id');
        if (!village) {
          village = 22;
        }
        wx.navigateTo({
          url: '../group-purchase/purchase?base_id=' + deInfo + '&villageId=' + village
        })
      }
    
  },
  //选择项目
  chooseItem:function(e){
    let index = e.currentTarget.dataset.index;
    let checkIndex = this.data.checkIndex;
    let type = e.currentTarget.dataset.type;
    let items = this.data.items;
    let fProductType = e.currentTarget.dataset.protype;
    console.log(fProductType,"fProductType")
      let project = '';
      if(type === 't0'){
          project = items[checkIndex].t0[index];
    }else if(type === 't1'){
          project = items[checkIndex].t1[index];
    }else{
          project = items[checkIndex].t2[index];
    }
    let url = '';
    let village = wx.getStorageSync('village_id');
    if(!village){
        village = 22;
    }
    if(checkIndex === 0){
        project = items[checkIndex].projectInfoList[index];
        url = '../group-purchase/purchase?base_id='+project.id+'&villageId='+village;
    }else{
        if(project.project_type === 1){
            wx.navigateTo({
                url: '../agentShop/shop?id='+project.id
            })
            return
        }else{
        //正常的下订金页面
          if (project.status === 2) {
            url = '../collect3/collect?id=' + project.id;
          } else {
            url = '../collect2/collect?id=' + project.id;
          }
//临时加的安居佳 
        if (fProductType == 4){
            url = '../anjujia/anjujia?id=' + project.id;
          }
        }
    }
    wx.navigateTo({ url: url })

  },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        return {
            title: '多让建材/家具/家电 + 买手严选 正品保障 大牌低价',
            desc: '买手严选 正品保障 大牌低价',
            success: function(res) {
                _base.showToast('分享成功', 'success');
            },
            fail: function(res) {
                // _base.showToast('取消分享');
            }
        }
    }
})
