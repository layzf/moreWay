import { Base } from '../../utils/base.js';
import { Api } from '../../utils/api.js';
var _base = new Base();
var _api = new Api();
const app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    isOpenGps: true, // 不要手动修改
    hasLocation: true,
    isAuth: false,
    searchDataShow:false,
    searchKeyWords: '',
    searchResShow: false,
    hasInvite: false,
    village:'',
    villageId:'',
    historyList: [],
    List:'null',
    localStreet:'',
    nearVillage:'',
    nearEaste:'',
    nearEasteShow:false,
    groupMasterPhone:'15629083308',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'RR5BZ-3SX3G-QIPQH-IT4J3-2EXG3-DUBOH'
    });
      this.loadLocation();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let historyData = wx.getStorageSync('historyData');
    console.log(historyData);
    for (var i = 0;i<historyData.length;i++){
      if (historyData[i].estateId==undefined){
       historyData.splice(i,1);
       this.setData({
         historyList: historyData
       });
      }else{
        this.setData({
          historyList: historyData
        });
      }
    }
  },

  contactGroupMaster(){
    wx.makePhoneCall({
      phoneNumber: '15629083308' //仅为示例，并非真实的电话号码
    })
  },

  toGroupPage: function (event) {
    console.log(event);
    var hisJudge;
    let estate = {
      estateId: _base.getDataSet(event, 'id'),
      estateName: _base.getDataSet(event, 'villagename'),
      estateStatus: _base.getDataSet(event, 'status')
    }
    app.groupEstatePara = estate;
    if (estate.estateStatus==undefined){
      wx.reLaunch({
        url: "/pages/group/group?hisJudge=1&village_id=" + estate.estateId
      });
    }else{
      var village_id = _base.getDataSet(event, 'id');
      wx.reLaunch({
        url: "/pages/group/group?helpIndex=1&village_id=" + estate.estateId
      })
    }
  },
  nearVillage:function(e){
    console.log(e);
    var becomeJudge;
    var estateStatus = _base.getDataSet(e, 'estateStatus')
    let estate = {
      estateId: _base.getDataSet(e,'id'),
      estateName: _base.getDataSet(e,'villagename')
    }
    app.groupEstatePara = estate;
    wx.reLaunch({
      url: "/pages/group/group?becomeJudge=1&village_id=" + estate.estateId
    })
  },
  // 调用重新定位
  relocation:function(){
    this.loadLocation();
    this.setData({
      searchDataShow: false,
      searchResShow: false
    })
  },
  onDeleteHistoryTap: function () {
    wx.removeStorageSync('historyData');
    this.setData({
      historyList: []
    })
  },

  onSelectSearchTap: function (e) {
    let village = e.currentTarget.dataset.village;
    let villageId = e.currentTarget.dataset.villageid;
    let locationLat = _base.getDataSet(e, 'locationlat');
    let locationing = _base.getDataSet(e, 'locationing');
    _api.getEstates(locationLat, locationing, (res) => {
      console.log(res);
      if(res.data.length==0){
        this.setData({
          nearEasteShow: true
        })
      }else{
        this.setData({
          nearVillage: res.data
        })
      }
    })
    this.setData({
      searchDataShow: false,
      searchResShow: true,
      village: village,
      villageId: villageId,
    })
  },

  onSearchInput: function (e) {
    var that = this
    this.setData({
      searchKeyWords: e.detail.value
    })
    // 调用接口
    qqmapsdk.getSuggestion({
      keyword: this.data.searchKeyWords,
      region: '长沙市',
      success: function (res) {
        that.setData({
          adressList: res.data,
          searchDataShow: true,
          isOpenGps: true,
          searchResShow: false
        })
      },
      fail: function (res) {
        console.log(res);
      },
    });
  },

  loadLocation: function () {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      altitude:true,
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.setData({
          isOpenGps: true
        })
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            var obj=res.result.location;
            _api.getEstates(obj.lat, obj.lng,(res)=>{
              console.log(res);
              if(res.data.length==0){
                  that.setData({
                    nearEasteShow: true
                  })
              }else{
                that.setData({
                  nearEaste: res.data
                })
              }
            })
            that.setData({
              localStreet: res.result.address_reference.town.title
            })
          },
          fail: function (res) {
            console.log(res);
          },
        });
        // TODO: 调所在小区接口
        // TODO: 调附近小区采集群的接口
      },
      fail: function (res) {
        that.setData({
          isOpenGps: false
        })
      }
    })
  },

  getWxSetting: function () {
    wx.getSetting({
      success: (res) => {
        console.log(res);
        this.loadLocation();
        let isAuthGps = res.authSetting['scope.userLocation'];
        // console.log(isAuthGps);
        if (!isAuthGps) {
          this.reOpenGps();
          return false;
        }
        if (isAuthGps && !this.data.isOpenGps) {
          _base.showToast('请开启手机GPS定位');
          return false;
        }
      }
    })
  },

  reOpenGps: function () {
    wx.openSetting({
      success: (res) => {
        res.authSetting = {
          "scope.userLocation": true
        }
        this.loadLocation();
      }
    })
  },
  // 申请开通小区
  applyOpen:function(){
    wx.navigateTo({
      url: '../applyOpen/applyOpen'
    })
  },
  //助力开通小区
  runOpen:function(e){
    var  helpIndex;
    let estate = {
      estateId: _base.getDataSet(e, 'id'),
      estateName: _base.getDataSet(e, 'villagename'),
      estateStatus: _base.getDataSet(e, 'status')
    }
    var village_id = _base.getDataSet(e, 'id');
    app.groupEstatePara = estate;
    wx.reLaunch({
      url: "/pages/group/group?helpIndex=1&village_id=" + village_id
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